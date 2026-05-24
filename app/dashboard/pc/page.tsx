"use client";

// import { zodResolver } from "@hookform/resolvers/zod";
import { type ClassValue, clsx } from "clsx";
import {
	Edit2,
	ExternalLink,
	MapPin,
	Package,
	Plus,
	Search,
	Star,
	Store,
	Tag,
	Trash2,
	// X,
} from "lucide-react";
import { useState } from "react";
// import { Controller, useFieldArray, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import type { IPCComponentPopulated } from "@/actions/pcComponent.action";
import { ComponentFormDialog } from "@/components/dashboardComponents/ComponentFormDialog";
import { ShopFormDialog } from "@/components/dashboardComponents/ShopFormDialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	// DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	// useCreateComponent,
	useDeleteComponent,
	useFetchPaginatedComponents,
	// useUpdateComponent,
} from "@/hooks/usePCComponents";
import {
	type IShopPopulated,
	// useCreateShop,
	useDeleteShop,
	useFetchShops,
	// useUpdateShop,
} from "@/hooks/useShops";
import type { ComponentCategory } from "@/models/pcComponent.model";

// import {
// 	type PCComponentInput,
// 	pcComponentInputSchema,
// 	type ShopInput,
// 	shopInputSchema,
// } from "@/validators/pcComponent";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const CATEGORIES = [
	"CPU",
	"GPU",
	"RAM",
	"Motherboard",
	"Storage",
	"PSU",
	"Case",
	"Cooler",
] as const;

// const USAGE_TAGS = [
// 	"Gaming",
// 	"Content Creation",
// 	"Development",
// 	"Office & Web",
// ] as const;

// const BUDGET_TIERS = [
// 	{ value: "budget", label: "Budget" },
// 	{ value: "mid", label: "Mid-range" },
// 	{ value: "high-end", label: "High-end" },
// ] as const;

// const STOCK_OPTIONS = [
// 	{ value: "in_stock", label: "In Stock" },
// 	{ value: "out_of_stock", label: "Out of Stock" },
// 	{ value: "limited", label: "Limited" },
// ] as const;

function formatPrice(price: number) {
	return new Intl.NumberFormat("bn-BD", {
		style: "currency",
		currency: "BDT",
		maximumFractionDigits: 0,
	}).format(price);
}

function StockBadge({ stock }: { stock: string }) {
	const map: Record<string, string> = {
		in_stock: "bg-emerald-50 text-emerald-700 border-emerald-200",
		limited: "bg-amber-50 text-amber-700 border-amber-200",
		out_of_stock: "bg-red-50 text-red-700 border-red-200",
	};
	const label: Record<string, string> = {
		in_stock: "In Stock",
		limited: "Limited",
		out_of_stock: "Out of Stock",
	};
	return (
		<span
			className={cn(
				"text-[10px] font-semibold border px-2 py-0.5 rounded-full",
				map[stock] ?? "bg-slate-50 text-slate-600 border-slate-200",
			)}
		>
			{label[stock] ?? stock}
		</span>
	);
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
// function Field({
// 	label,
// 	error,
// 	children,
// }: {
// 	label: string;
// 	error?: string;
// 	children: React.ReactNode;
// }) {
// 	return (
// 		<div className="space-y-1.5">
// 			<Label className="text-xs font-semibold text-slate-700">{label}</Label>
// 			{children}
// 			{error && <p className="text-[11px] text-red-500">{error}</p>}
// 		</div>
// 	);
// }

// ── Shops List Dialog ─────────────────────────────────────────────────────────
function ShopsListDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { data: shops = [] } = useFetchShops();
	const [editingShop, setEditingShop] = useState<IShopPopulated | null>(null);
	const [shopFormOpen, setShopFormOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
	const deleteMutation = useDeleteShop();

	const confirmDelete = async () => {
		if (!deleteTarget) return;
		await deleteMutation.mutateAsync(deleteTarget);
		setDeleteTarget(null);
	};

	const openCreate = () => {
		setEditingShop(null);
		setShopFormOpen(true);
	};

	const openEdit = (shop: IShopPopulated) => {
		setEditingShop(shop);
		setShopFormOpen(true);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between">
							<span>Manage Shops</span>
							<Button onClick={openCreate} size="sm" className="gap-1">
								<Plus className="w-3.5 h-3.5" />
								Add Shop
							</Button>
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-3">
						{shops.length === 0 ? (
							<div className="text-center py-8">
								<Store className="w-8 h-8 text-slate-300 mx-auto mb-2" />
								<p className="text-sm text-slate-500">No shops added yet</p>
							</div>
						) : (
							<div className="space-y-2">
								{shops.map((shop) => (
									<div
										key={shop._id}
										className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
									>
										<div>
											<div className="flex items-center gap-2">
												<p className="text-sm font-semibold text-slate-900">
													{shop.name}
												</p>
												<div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 rounded-full">
													<Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
													<span className="text-[10px] font-bold text-amber-700">
														{shop.rating?.toFixed(1) ?? "0.0"}
													</span>
												</div>
											</div>
											<div className="flex flex-col gap-0.5">
												<p className="text-xs text-slate-500">
													{shop.location}
												</p>
												{shop.lat && shop.long && (
													<span className="text-[10px] text-slate-400 flex items-center gap-0.5">
														<MapPin className="w-2.5 h-2.5" />
														{shop.lat.toFixed(4)}, {shop.long.toFixed(4)}
													</span>
												)}
											</div>
											{shop.website && (
												<a
													href={shop.website}
													target="_blank"
													rel="noopener noreferrer"
													className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
												>
													Visit
													<ExternalLink className="w-3 h-3" />
												</a>
											)}
										</div>
										<div className="flex gap-1">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => openEdit(shop)}
												className="h-8 w-8"
											>
												<Edit2 className="w-3.5 h-3.5" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => setDeleteTarget(shop._id)}
												className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
											>
												<Trash2 className="w-3.5 h-3.5" />
											</Button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>

			<ShopFormDialog
				open={shopFormOpen}
				onOpenChange={setShopFormOpen}
				editing={editingShop}
			/>

			<AlertDialog
				open={!!deleteTarget}
				onOpenChange={(o) => !o && setDeleteTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Shop?</AlertDialogTitle>
						<AlertDialogDescription>
							This will remove the shop. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

// ── Main Dashboard Page ───────────────────────────────────────────────────────
export default function ComponentsDashboardPage() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [shopsDialogOpen, setShopsDialogOpen] = useState(false);
	const [editingComponent, setEditingComponent] =
		useState<IPCComponentPopulated | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

	const { data, isLoading } = useFetchPaginatedComponents({
		page,
		pageSize: 10,
		search: search || undefined,
		category: (categoryFilter as ComponentCategory) || undefined,
	});

	const deleteMutation = useDeleteComponent();

	const openCreate = () => {
		setEditingComponent(null);
		setDialogOpen(true);
	};

	const openEdit = (component: IPCComponentPopulated) => {
		setEditingComponent(component);
		setDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!deleteTarget) return;
		await deleteMutation.mutateAsync(deleteTarget);
		setDeleteTarget(null);
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">PC Components</h1>
					<p className="text-sm text-slate-500 mt-0.5">
						Manage components and shop listings
					</p>
				</div>
				<div className="flex gap-2">
					<Button onClick={openCreate} className="gap-2">
						<Plus className="w-4 h-4" />
						Add Component
					</Button>
					<Button
						onClick={() => setShopsDialogOpen(true)}
						variant="outline"
						className="gap-2"
					>
						<Store className="w-4 h-4" />
						Manage Shops
					</Button>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						label: "Total Components",
						value: data?.totalCount ?? "—",
						icon: Package,
						color: "text-blue-600 bg-blue-50",
					},
					{
						label: "Categories",
						value: CATEGORIES.length,
						icon: Tag,
						color: "text-purple-600 bg-purple-50",
					},
					{
						label: "Current Page",
						value: data?.currentPage ?? 1,
						icon: Store,
						color: "text-emerald-600 bg-emerald-50",
					},
					{
						label: "Total Pages",
						value: data?.totalPages ?? "—",
						icon: Package,
						color: "text-orange-600 bg-orange-50",
					},
				].map((stat) => {
					const Icon = stat.icon;
					return (
						<Card key={stat.label} className="border-slate-100 shadow-sm">
							<CardContent className="p-4 flex items-center gap-3">
								<div className={cn("p-2 rounded-xl", stat.color)}>
									<Icon className="w-5 h-5" />
								</div>
								<div>
									<p className="text-2xl font-black text-slate-900">
										{stat.value}
									</p>
									<p className="text-xs text-slate-500">{stat.label}</p>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Filters */}
			<Card className="border-slate-100 shadow-sm">
				<CardContent className="p-4 flex flex-col sm:flex-row gap-3">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<Input
							placeholder="Search components..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							className="pl-9"
						/>
					</div>
					<Select
						value={categoryFilter || "all"}
						onValueChange={(v) => {
							setCategoryFilter(v === "all" ? "" : v);
							setPage(1);
						}}
					>
						<SelectTrigger className="w-full sm:w-44">
							<SelectValue placeholder="All categories" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All categories</SelectItem>
							{CATEGORIES.map((c) => (
								<SelectItem key={c} value={c}>
									{c}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</CardContent>
			</Card>

			{/* Table */}
			<Card className="border-slate-100 shadow-sm">
				<Table>
					<TableHeader>
						<TableRow className="bg-slate-50/50">
							<TableHead>Component</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>CPU Specs (Cores/Threads)</TableHead>
							<TableHead>Shop Listings</TableHead>
							<TableHead>Lowest Price</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading
							? Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={i}>
										{Array.from({ length: 6 }).map((_, j) => (
											<TableCell key={j}>
												<Skeleton className="h-4 w-full" />
											</TableCell>
										))}
									</TableRow>
								))
							: data?.items.map((component) => {
									const lowestListing = [...component.shopListings].sort(
										(a, b) => a.price - b.price,
									)[0];
									return (
										<TableRow key={component._id} className="group">
											<TableCell>
												<div>
													<p className="font-semibold text-sm text-slate-900">
														{component.name}
													</p>
													<p className="text-xs text-slate-500">
														{component.brand}
													</p>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="secondary" className="text-xs">
													{component.category}
												</Badge>
											</TableCell>
											<TableCell>
												{component.category === "CPU" ? (
													<span className="text-xs text-slate-600">
														{component.cores && component.threads
															? `${component.cores} cores / ${component.threads} threads`
															: "—"}
													</span>
												) : (
													<span className="text-xs text-slate-400">—</span>
												)}
											</TableCell>
											<TableCell>
												<div className="space-y-0.5">
													{component.shopListings.slice(0, 2).map((l) => (
														<div
															key={l._id}
															className="flex items-center gap-1.5"
														>
															<StockBadge stock={l.stock} />
															<span className="text-[10px] text-slate-500">
																{l.shop.name}
															</span>
															{l.url && (
																<a
																	href={l.url}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-slate-300 hover:text-blue-500"
																>
																	<ExternalLink className="w-3 h-3" />
																</a>
															)}
														</div>
													))}
													{component.shopListings.length > 2 && (
														<p className="text-[10px] text-slate-400">
															+{component.shopListings.length - 2} more
														</p>
													)}
													{component.shopListings.length === 0 && (
														<span className="text-[10px] text-slate-400">
															No listings
														</span>
													)}
												</div>
											</TableCell>
											<TableCell>
												{lowestListing ? (
													<span className="font-bold text-sm text-slate-900">
														{formatPrice(lowestListing.price)}
													</span>
												) : (
													<span className="text-xs text-slate-400">—</span>
												)}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
														onClick={() => openEdit(component)}
													>
														<Edit2 className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
														onClick={() => setDeleteTarget(component._id)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									);
								})}
					</TableBody>
				</Table>

				{/* Pagination */}
				{data && data.totalPages > 1 && (
					<div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
						<p className="text-xs text-slate-500">
							Page {data.currentPage} of {data.totalPages} · {data.totalCount}{" "}
							total
						</p>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => p + 1)}
								disabled={page >= data.totalPages}
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</Card>

			{/* Form Dialog */}
			<ComponentFormDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				editing={editingComponent}
			/>

			{/* Shops Dialog */}
			<ShopsListDialog
				open={shopsDialogOpen}
				onOpenChange={setShopsDialogOpen}
			/>

			{/* Delete confirm */}
			<AlertDialog
				open={!!deleteTarget}
				onOpenChange={(o) => !o && setDeleteTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Component?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently remove the component and all its shop
							listings. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
