interface TechSpec {
	cores: number;
	threads: number;
	ram: number; // GB
	vram: number; // GB
	ssd: number; // GB
}

interface BuildResult {
	minimum: TechSpec;
	recommended: TechSpec;
}

interface AppState {
	mainUsage: string;
	browserTabs: number;
	software: string[];
	storageNeeds: string;
}

export const calculateBuildSpecs = (state: AppState): BuildResult => {
	const { mainUsage, browserTabs, software, storageNeeds } = state;

	let min: TechSpec = { cores: 4, threads: 8, ram: 8, vram: 0, ssd: 256 };
	let rec: TechSpec = { cores: 6, threads: 12, ram: 16, vram: 2, ssd: 512 };

	if (mainUsage === "Gaming") {
		min = { cores: 6, threads: 12, ram: 16, vram: 4, ssd: 512 };
		rec = { cores: 8, threads: 16, ram: 32, vram: 12, ssd: 1024 };
	} else if (mainUsage === "Content Creation") {
		min = { cores: 8, threads: 16, ram: 32, vram: 6, ssd: 1024 };
		rec = { cores: 16, threads: 32, ram: 64, vram: 16, ssd: 2048 };
	} else if (mainUsage === "Development") {
		min = { cores: 6, threads: 12, ram: 16, vram: 2, ssd: 512 };
		rec = { cores: 12, threads: 20, ram: 64, vram: 8, ssd: 1024 };
	}

	if (browserTabs > 30) {
		min.ram += 8;
		rec.ram += 16;
	}
	if (browserTabs > 60) {
		min.ram += 16;
		rec.ram += 32;
	}

	if (software.includes("Adobe Premiere") || software.includes("AutoCAD")) {
		min.vram = Math.max(min.vram, 6);
		rec.vram = Math.max(rec.vram, 12);
		min.cores = Math.max(min.cores, 8);
		rec.cores = Math.max(rec.cores, 12);
	}

	if (software.includes("Visual Studio Code") && mainUsage === "Development") {
		rec.ram = Math.max(rec.ram, 32); // IDE + Docker context
	}

	if (storageNeeds === "Medium") {
		min.ssd = Math.max(min.ssd, 512);
		rec.ssd = Math.max(rec.ssd, 1024);
	} else if (storageNeeds === "Heavy") {
		min.ssd = Math.max(min.ssd, 1024);
		rec.ssd = Math.max(rec.ssd, 4096);
	}

	return { minimum: min, recommended: rec };
};
