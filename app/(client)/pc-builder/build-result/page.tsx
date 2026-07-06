

import { Suspense } from "react";
import BuildResultClient from "@/components/appComponents/BuildResultClient";

export default function BuildResultPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="w-12 h-12 rounded-2xl bg-blue-100 animate-pulse" />
						<p className="text-sm text-slate-500 animate-pulse">
							Building your PC plan...
						</p>
					</div>
				</div>
			}
		>
			<BuildResultClient />
		</Suspense>
	);
}
