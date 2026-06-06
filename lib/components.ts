export interface PCComponent {
	id: string;
	name: string;
	brand: string;
	price: number;
	image: string;
	category: "CPU" | "Motherboard" | "RAM" | "GPU" | "Storage" | "PSU" | "Case";
	specs: Record<string, string>;
}

export const PC_COMPONENTS: PCComponent[] = [
	// CPUs
	{
		id: "cpu-1",
		name: "Core i9-14900K",
		brand: "Intel",
		price: 589,
		category: "CPU",
		image:
			"https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop",
		specs: {
			Cores: "24",
			Threads: "32",
			"Base Clock": "3.2 GHz",
			"Boost Clock": "6.0 GHz",
		},
	},
	{
		id: "cpu-2",
		name: "Ryzen 9 7950X3D",
		brand: "AMD",
		price: 699,
		category: "CPU",
		image:
			"https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop",
		specs: {
			Cores: "16",
			Threads: "32",
			"Base Clock": "4.2 GHz",
			"Boost Clock": "5.7 GHz",
			"L3 Cache": "128MB",
		},
	},
	// GPUs
	{
		id: "gpu-1",
		name: "GeForce RTX 4090",
		brand: "NVIDIA",
		price: 1599,
		category: "GPU",
		image:
			"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop",
		specs: { VRAM: "24GB GDDR6X", "Core Clock": "2.23 GHz", TDP: "450W" },
	},
	{
		id: "gpu-2",
		name: "Radeon RX 7900 XTX",
		brand: "AMD",
		price: 949,
		category: "GPU",
		image:
			"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop",
		specs: { VRAM: "24GB GDDR6", "Core Clock": "2.3 GHz", TDP: "355W" },
	},
	// Motherboards
	{
		id: "mobo-1",
		name: "ROG MAXIMUS Z790 HERO",
		brand: "ASUS",
		price: 629,
		category: "Motherboard",
		image:
			"https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
		specs: { Socket: "LGA1700", Chipset: "Z790", Memory: "DDR5" },
	},
	// RAM
	{
		id: "ram-1",
		name: "Dominator Titanium 64GB",
		brand: "Corsair",
		price: 320,
		category: "RAM",
		image:
			"https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=1000&auto=format&fit=crop",
		specs: { Capacity: "64GB (2x32GB)", Speed: "6600 MT/s", Type: "DDR5" },
	},
	// Storage
	{
		id: "ssd-1",
		name: "990 Pro 2TB",
		brand: "Samsung",
		price: 179,
		category: "Storage",
		image:
			"https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=1000&auto=format&fit=crop",
		specs: {
			Capacity: "2TB",
			Interface: "NVMe Gen4",
			"Read Speed": "7450 MB/s",
		},
	},
	// Case
	{
		id: "case-1",
		name: "O11 Dynamic EVO",
		brand: "Lian Li",
		price: 169,
		category: "Case",
		image:
			"https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1000&auto=format&fit=crop",
		specs: { Type: "Mid Tower", SidePanel: "Tempered Glass" },
	},
	// PSU
	{
		id: "psu-1",
		name: "HX1200i 1200W",
		brand: "Corsair",
		price: 289,
		category: "PSU",
		image:
			"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop",
		specs: { Wattage: "1200W", Efficiency: "80+ Platinum" },
	},
];
