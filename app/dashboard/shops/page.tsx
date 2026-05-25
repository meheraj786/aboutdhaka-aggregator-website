"use client";

import { Edit2, ExternalLink, MapPin, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import type { IShopPopulated } from "@/actions/shop.action";
import { ShopFormDialog } from "@/components/dashboardComponents/ShopFormDialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	// AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useDeleteShop, useFetchShops } from "@/hooks/useShops";

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ShopsDashboardPage() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingShop, setEditingShop] = useState<IShopPopulated | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

	const { data: shops, isLoading } = useFetchShops();
	const deleteMutation = useDeleteShop();

	const openCreate = () => {
		setEditingShop(null);
		setDialogOpen(true);
	};

	const openEdit = (shop: IShopPopulated) => {
		setEditingShop(shop);
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
					<h1 className="text-3xl font-bold text-slate-900">PC Shops</h1>
					<p className="text-sm text-slate-500 mt-1">
						Manage computer shops where components are available
					</p>
				</div>
				<Button onClick={openCreate} className="gap-2">
					<Plus className="w-4 h-4" />
					Add Shop
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="p-4 border-slate-100 shadow-sm">
					<p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
						Total Shops
					</p>
					<p className="text-2xl font-bold text-slate-900">
						{shops?.length ?? 0}
					</p>
				</Card>
				<Card className="p-4 border-slate-100 shadow-sm">
					<p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
						Active Shops
					</p>
					<p className="text-2xl font-bold text-slate-900">
						{shops?.filter((s) => s.website || s.phone).length ?? 0}
					</p>
				</Card>
				<Card className="p-4 border-slate-100 shadow-sm">
					<p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
						In Dhaka
					</p>
					<p className="text-2xl font-bold text-slate-900">
						{shops?.filter((s) => s.location.toLowerCase().includes("dhaka"))
							.length ?? 0}
					</p>
				</Card>
			</div>

			{/* Table */}
			<Card className="border-slate-100 shadow-sm">
				<Table>
					<TableHeader>
						<TableRow className="bg-slate-50/50">
							<TableHead>Shop Name</TableHead>
							<TableHead>Location & Coordinates</TableHead>
							<TableHead>Rating</TableHead>
							<TableHead>Website</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: 5 }).map((_, i) => (
								<TableRow key={i}>
									{Array.from({ length: 6 }).map((_, j) => (
										<TableCell key={j}>
											<Skeleton className="h-4 w-full" />
										</TableCell>
									))}
								</TableRow>
							))
						) : (shops?.length ?? 0) === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-8">
									<p className="text-sm text-slate-500">No shops added yet</p>
								</TableCell>
							</TableRow>
						) : (
							shops?.map((shop) => (
								<TableRow key={shop._id} className="group">
									<TableCell>
										<div>
											<p className="font-semibold text-sm text-slate-900">
												{shop.name}
											</p>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex flex-col gap-0.5">
											<span className="text-xs text-slate-600">
												{shop.location}
											</span>
											{shop.lat && shop.long && (
												<span className="text-[10px] text-slate-400 flex items-center gap-0.5">
													<MapPin className="w-2.5 h-2.5" />
													{shop.lat.toFixed(4)}, {shop.long.toFixed(4)}
												</span>
											)}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Star className="w-3 h-3 fill-amber-400 text-amber-400" />
											<span className="text-xs font-medium text-slate-700">
												{shop.rating?.toFixed(1) ?? "0.0"}
											</span>
										</div>
									</TableCell>
									<TableCell>
										{shop.website ? (
											<a
												href={shop.website}
												target="_blank"
												rel="noopener noreferrer"
												className="text-xs text-blue-600 hover:underline flex items-center gap-1"
											>
												Visit
												<ExternalLink className="w-3 h-3" />
											</a>
										) : (
											<span className="text-xs text-slate-400">—</span>
										)}
									</TableCell>
									<TableCell>
										<span className="text-xs text-slate-600">
											{shop.phone ?? "—"}
										</span>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Card>

			{/* Form Dialog */}
			<ShopFormDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				editing={editingShop}
			/>

			{/* Delete confirm */}
			<AlertDialog
				open={!!deleteTarget}
				onOpenChange={(o) => !o && setDeleteTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Shop?</AlertDialogTitle>
						<AlertDialogDescription>
							This will remove the shop and all associated listings. This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex gap-2">
						<AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="flex-1 bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
