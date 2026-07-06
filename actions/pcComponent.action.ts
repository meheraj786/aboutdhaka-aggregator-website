"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/db";
import {
  type BudgetTier,
  type ComponentCategory,
  type IPCComponent,
  PCComponent,
  type RamGeneration,
  type SocketType,
  type StorageInterface,
} from "@/models/pcComponent.model";
import type { PCComponentInput } from "@/validators/pcComponent";

export interface IShopListingPopulated {
  _id: string;
  shop: {
    _id: string;
    name: string;
    location: string;
    lat?: number;
    long?: number;
    website?: string;
    phone?: string;
    rating?: number;
  };
  price: number;
  stock: "in_stock" | "out_of_stock" | "limited";
  url?: string;
  lastUpdated: string;
}

export interface IPCComponentPopulated {
  _id: string;
  name: string;
  brand: string;
  category: ComponentCategory;
  imageUrl?: string;
  specs: Record<string, string | number | boolean | null | undefined>;
  shopListings: IShopListingPopulated[];
  usageTags: string[];
  minBudgetTier: BudgetTier;
  socket?: SocketType;
  cores?: number;
  threads?: number;
  tdpWatt?: number;
  supportedRamGeneration?: RamGeneration;
  supportedStorageInterfaces?: StorageInterface[];
  ramGeneration?: RamGeneration;
  ramCapacityGb?: number;
  vramGb?: number;
  gpuTdpWatt?: number;
  storageInterface?: StorageInterface;
  storageCapacityGb?: number;
  wattage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetComponentsParams {
  page: number;
  pageSize: number;
  search?: string;
  category?: ComponentCategory;
}

export interface SuggestionQuery {
  mainUsage: "Gaming" | "Content Creation" | "Development" | "Office & Web";
  browserTabs: number;
  software: string[];
  storageNeeds: "Light" | "Medium" | "Heavy";
  budgetTier: BudgetTier;
}

export interface SuggestedBuild {
  category: ComponentCategory;
  components: IPCComponentPopulated[];
  minSpecs?: {
    minCores?: number;
    minRAM?: number;
  };
}

const TIER_PRICE_CAPS: Record<BudgetTier, number> = {
  budget: 60000,
  mid: 120000,
  "high-end": Infinity,
};

function serializeData<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (
    typeof data === "object" &&
    (data as { constructor?: { name?: string } }).constructor?.name ===
      "ObjectId"
  )
    return (data as { toString(): string }).toString() as unknown as T;
  if (data instanceof Date) return data.toISOString() as unknown as T;
  if (Array.isArray(data)) return data.map(serializeData) as unknown as T;
  if (typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const key in data) {
      if (Object.hasOwn(data as object, key))
        result[key] = serializeData((data as Record<string, unknown>)[key]);
    }
    return result as T;
  }
  return data;
}

function getBudgetTiers(tier: BudgetTier): BudgetTier[] {
  if (tier === "budget") return ["budget"];
  if (tier === "mid") return ["budget", "mid"];
  return ["budget", "mid", "high-end"];
}

function getMinCores(usage: string, software: string[]): number {
  const baseMap: Record<string, number> = {
    Gaming: 6,
    "Content Creation": 12,
    Development: 4,
    "Office & Web": 2,
  };
  let base = baseMap[usage] ?? 4;
  if (software.includes("Blender") || software.includes("DaVinci Resolve")) {
    base = Math.max(base, 12);
  } else if (
    software.includes("Adobe Premiere") ||
    software.includes("AutoCAD")
  ) {
    base = Math.max(base, 8);
  } else if (software.includes("Visual Studio Code")) {
    base = Math.max(base, 4);
  }
  return base;
}

function getMinRAM(tabs: number, software: string[]): number {
  let base = 8;
  if (tabs > 50) base = 64;
  else if (tabs > 30) base = 32;
  else if (tabs > 10) base = 16;
  const heavy = ["Adobe Premiere", "DaVinci Resolve", "Blender", "AutoCAD"];
  if (software.some((s) => heavy.includes(s))) base = Math.max(base, 32);
  return base;
}

function getMinVRAM(software: string[], usage: string): number {
  if (
    software.includes("Adobe Premiere") ||
    software.includes("DaVinci Resolve") ||
    software.includes("Blender")
  )
    return 8;
  if (usage === "Gaming") return 6;
  if (usage === "Content Creation") return 8;
  return 4;
}

function getMinWattage(usage: string, software: string[]): number {
  const isHeavy =
    usage === "Gaming" ||
    usage === "Content Creation" ||
    software.includes("Blender") ||
    software.includes("Adobe Premiere");
  if (isHeavy) return 650;
  if (usage === "Development") return 550;
  return 450;
}

function sortByLowestPrice(
  components: IPCComponentPopulated[],
): IPCComponentPopulated[] {
  return [...components].sort((a, b) => {
    const aMin =
      a.shopListings.length > 0
        ? Math.min(...a.shopListings.map((l) => l.price))
        : Number.MAX_SAFE_INTEGER;
    const bMin =
      b.shopListings.length > 0
        ? Math.min(...b.shopListings.map((l) => l.price))
        : Number.MAX_SAFE_INTEGER;
    return aMin - bMin;
  });
}

const SHOP_POPULATE = {
  path: "shopListings.shop",
  select: "name location lat long website phone rating",
};

async function fetchCategory(
  category: ComponentCategory,
  usage: string,
  budgetTiers: BudgetTier[],
  budgetTier: BudgetTier,
  limit: number = 3,
  compatibilityFilter?: Record<string, unknown>,
): Promise<IPCComponentPopulated[]> {
  const baseFilter: Record<string, unknown> = {
    category,
    ...compatibilityFilter,
  };

  let docs: any[] = [];

  const attempts = [
    {
      name: "usage+budget+compat",
      filter: {
        ...baseFilter,
        usageTags: usage,
        minBudgetTier: { $in: budgetTiers },
      },
    },
    {
      name: "budget+compat",
      filter: {
        ...baseFilter,
        minBudgetTier: { $in: budgetTiers },
      },
    },
    {
      name: "compat+pricecap",
      filter: {
        ...baseFilter,
      },
      applyPriceCap: true,
    },
    {
      name: "category+pricecap",
      filter: { category },
      applyPriceCap: true,
    },
  ];

  for (const attempt of attempts) {
    docs = await PCComponent.find(attempt.filter)
      .limit(limit * 3)
      .populate(SHOP_POPULATE)
      .lean();

    if (attempt.applyPriceCap) {
      const cap = TIER_PRICE_CAPS[budgetTier] || Infinity;
      docs = docs.filter((c: any) => {
        const minPrice = Math.min(...c.shopListings.map((l: any) => l.price));
        return minPrice <= cap;
      });
    }

    if (docs.length > 0) break;
  }

  let serialized = serializeData(docs as unknown as IPCComponentPopulated[]);
  serialized = serialized.filter((c) => c.shopListings.length > 0);

  const userTier = budgetTier;
  serialized.sort((a, b) => {
    const aMin = Math.min(...a.shopListings.map((l) => l.price));
    const bMin = Math.min(...b.shopListings.map((l) => l.price));
    const aTierMatch = a.minBudgetTier === userTier ? 0 : 1;
    const bTierMatch = b.minBudgetTier === userTier ? 0 : 1;
    if (aTierMatch !== bTierMatch) return aTierMatch - bTierMatch;
    return aMin - bMin;
  });

  return serialized.slice(0, limit);
}

export async function getComponents(params?: GetComponentsParams): Promise<
  | IPCComponentPopulated[]
  | {
      items: IPCComponentPopulated[];
      totalCount: number;
      currentPage: number;
      totalPages: number;
    }
> {
  await dbConnect();

  if (!params) {
    const components = await PCComponent.find({})
      .sort({ category: 1, name: 1 })
      .populate(SHOP_POPULATE)
      .lean();
    return serializeData(components as unknown as IPCComponentPopulated[]);
  }

  const skip = (params.page - 1) * params.pageSize;
  const query: Record<string, unknown> = {};
  if (params.search) query.name = { $regex: params.search, $options: "i" };
  if (params.category) query.category = params.category;

  const [items, totalCount] = await Promise.all([
    PCComponent.find(query)
      .sort({ category: 1, name: 1 })
      .skip(skip)
      .limit(params.pageSize)
      .populate(SHOP_POPULATE)
      .lean(),
    PCComponent.countDocuments(query),
  ]);

  return {
    items: serializeData(items as unknown as IPCComponentPopulated[]),
    totalCount,
    currentPage: params.page,
    totalPages: Math.ceil(totalCount / params.pageSize),
  };
}

export async function getSuggestedBuild(
  query: SuggestionQuery,
): Promise<SuggestedBuild[]> {
  await dbConnect();

  const tiers = getBudgetTiers(query.budgetTier);
  const minCores = getMinCores(query.mainUsage, query.software);
  const minRAM = getMinRAM(query.browserTabs, query.software);
  const minVRAM = getMinVRAM(query.software, query.mainUsage);
  const minWattage = getMinWattage(query.mainUsage, query.software);

  const results: SuggestedBuild[] = [];

  const cpuFilter: Record<string, unknown> = {};
  if (minCores > 0) cpuFilter.cores = { $gte: minCores };

  let cpus = await fetchCategory(
    "CPU",
    query.mainUsage,
    tiers,
    query.budgetTier,
    3,
    cpuFilter,
  );
  if (cpus.length === 0)
    cpus = await fetchCategory("CPU", query.mainUsage, tiers, query.budgetTier, 3);

  if (cpus.length > 0)
    results.push({ category: "CPU", components: cpus, minSpecs: { minCores } });

  const pickedCpu = cpus[0] ?? null;
  const pickedSocket: SocketType | null = pickedCpu?.socket ?? null;

  const mbFilter: Record<string, unknown> = {};
  if (pickedSocket) mbFilter.socket = pickedSocket;

  let mbs = await fetchCategory(
    "Motherboard",
    query.mainUsage,
    tiers,
    query.budgetTier,
    3,
    pickedSocket ? mbFilter : undefined,
  );
  if (mbs.length === 0 && pickedSocket)
    mbs = await fetchCategory(
      "Motherboard",
      query.mainUsage,
      tiers,
      query.budgetTier,
      3,
    );

  if (mbs.length > 0)
    results.push({ category: "Motherboard", components: mbs });

  const pickedMb = mbs[0] ?? null;
  const pickedRamGen: RamGeneration | null =
    pickedMb?.supportedRamGeneration ?? null;
  const pickedStorageInterfaces: StorageInterface[] =
    pickedMb?.supportedStorageInterfaces ?? [];

  const shouldIncludeGPU = (() => {
    if (query.mainUsage === "Office & Web") return false;
    if (query.mainUsage === "Development") {
      const gpuHeavy = ["Blender", "AutoCAD", "Adobe Premiere", "DaVinci Resolve"];
      return query.software.some((s) => gpuHeavy.includes(s));
    }
    return true;
  })();

  if (shouldIncludeGPU) {
    const gpuFilter: Record<string, unknown> = {};
    if (minVRAM > 0) gpuFilter.vramGb = { $gte: minVRAM };

    let gpus = await fetchCategory(
      "GPU",
      query.mainUsage,
      tiers,
      query.budgetTier,
      3,
      gpuFilter,
    );
    if (gpus.length === 0)
      gpus = await fetchCategory(
        "GPU",
        query.mainUsage,
        tiers,
        query.budgetTier,
        3,
      );

    if (gpus.length > 0) results.push({ category: "GPU", components: gpus });
  }

  const ramFilter: Record<string, unknown> = {};
  if (minRAM > 0) ramFilter.ramCapacityGb = { $gte: minRAM };
  if (pickedRamGen) ramFilter.ramGeneration = pickedRamGen;

  let rams = await fetchCategory(
    "RAM",
    query.mainUsage,
    tiers,
    query.budgetTier,
    3,
    ramFilter,
  );

  if (rams.length === 0 && pickedRamGen) {
    const ramFilterNoDdr: Record<string, unknown> = {};
    if (minRAM > 0) ramFilterNoDdr.ramCapacityGb = { $gte: minRAM };
    rams = await fetchCategory(
      "RAM",
      query.mainUsage,
      tiers,
      query.budgetTier,
      3,
      ramFilterNoDdr,
    );
  }

  if (rams.length === 0)
    rams = await fetchCategory(
      "RAM",
      query.mainUsage,
      tiers,
      query.budgetTier,
      3,
    );

  if (rams.length > 0)
    results.push({ category: "RAM", components: rams, minSpecs: { minRAM } });

  const storageFilter: Record<string, unknown> = {};
  if (pickedStorageInterfaces.length > 0)
    storageFilter.storageInterface = { $in: pickedStorageInterfaces };

  let storages = await fetchCategory(
    "Storage",
    query.mainUsage,
    tiers,
    query.budgetTier,
    3,
    pickedStorageInterfaces.length > 0 ? storageFilter : undefined,
  );

  if (storages.length === 0)
    storages = await fetchCategory(
      "Storage",
      query.mainUsage,
      tiers,
      query.budgetTier,
      3,
    );

  if (storages.length > 0)
    results.push({ category: "Storage", components: storages });

  const psuFilter: Record<string, unknown> = {};
  if (minWattage > 0) psuFilter.wattage = { $gte: minWattage };

  let psus = await fetchCategory(
    "PSU",
    query.mainUsage,
    tiers,
    query.budgetTier,
    3,
    psuFilter,
  );
  if (psus.length === 0)
    psus = await fetchCategory(
      "PSU",
      query.mainUsage,
      tiers,
      query.budgetTier,
      3,
    );

  if (psus.length > 0) results.push({ category: "PSU", components: psus });

  const cases = await fetchCategory(
    "Case",
    query.mainUsage,
    tiers,
    query.budgetTier,
    3,
  );
  if (cases.length > 0) results.push({ category: "Case", components: cases });

  const coolers = await fetchCategory(
    "Cooler",
    query.mainUsage,
    tiers,
    query.budgetTier,
    3,
  );
  if (coolers.length > 0)
    results.push({ category: "Cooler", components: coolers });

  return results;
}

export async function createComponent(
  data: PCComponentInput,
): Promise<IPCComponentPopulated> {
  await dbConnect();
  const component = await PCComponent.create(data as unknown as IPCComponent);
  revalidatePath("/dashboard/components");
  return serializeData(
    component.toObject() as unknown as IPCComponentPopulated,
  );
}

export async function updateComponent(
  id: string,
  data: PCComponentInput,
): Promise<IPCComponentPopulated> {
  await dbConnect();
  const component = await PCComponent.findByIdAndUpdate(
    id,
    data as unknown as IPCComponent,
    { new: true, runValidators: true },
  );
  if (!component) throw new Error("Component not found");
  revalidatePath("/dashboard/components");
  return serializeData(
    component.toObject() as unknown as IPCComponentPopulated,
  );
}

export async function deleteComponent(id: string): Promise<{ success: true }> {
  await dbConnect();
  await PCComponent.findByIdAndDelete(id);
  revalidatePath("/dashboard/components");
  return { success: true };
}

export async function upsertShopListing(
  componentId: string,
  listing: {
    shop: string;
    price: number;
    stock: "in_stock" | "out_of_stock" | "limited";
    url?: string;
  },
): Promise<IPCComponentPopulated> {
  await dbConnect();
  const component = await PCComponent.findById(componentId);
  if (!component) throw new Error("Component not found");

  const mongoose = await import("mongoose");
  const existing = component.shopListings.find(
    (l) => l.shop.toString() === listing.shop,
  );

  if (existing) {
    existing.price = listing.price;
    existing.stock = listing.stock;
    existing.url = listing.url;
    existing.lastUpdated = new Date();
  } else {
    component.shopListings.push({
      shop: new mongoose.default.Types.ObjectId(listing.shop),
      price: listing.price,
      stock: listing.stock,
      url: listing.url,
      lastUpdated: new Date(),
    });
  }

  await component.save();
  revalidatePath("/dashboard/components");
  return serializeData(
    component.toObject() as unknown as IPCComponentPopulated,
  );
}

export async function removeShopListing(
  componentId: string,
  shopId: string,
): Promise<{ success: true }> {
  await dbConnect();
  await PCComponent.findByIdAndUpdate(componentId, {
    $pull: { shopListings: { shop: shopId } },
  });
  revalidatePath("/dashboard/components");
  return { success: true };
}