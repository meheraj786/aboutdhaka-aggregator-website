"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateArea, useUpdateArea } from "@/hooks/useAreas";
import { type CreateAreaInput, createAreaSchema } from "@/validators/areas";

interface IArea {
	_id: string;
	name: string;
}

interface AreaFormDialogProps {
	area?: IArea;
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function AreaFormDialog({
	area,
	trigger,
	open: controlledOpen,
	onOpenChange,
}: AreaFormDialogProps) {
	const [localOpen, setLocalOpen] = useState(false);
	const { mutate: createArea, isPending: isCreating } = useCreateArea();
	const { mutate: updateArea, isPending: isUpdating } = useUpdateArea();
	const isPending = isCreating || isUpdating;
	const isEditing = !!area;

	// Handle controlled vs uncontrolled open state
	const isOpen = controlledOpen !== undefined ? controlledOpen : localOpen;
	const handleOpenChange = (newOpen: boolean) => {
		if (controlledOpen !== undefined) {
			onOpenChange?.(newOpen);
		} else {
			setLocalOpen(newOpen);
		}
	};

	const form = useForm<CreateAreaInput>({
		resolver: zodResolver(createAreaSchema) as Resolver<CreateAreaInput>,
		defaultValues: {
			name: "",
		},
	});

	// Initialize form with area data when in edit mode
	useEffect(() => {
		if (isEditing && area) {
			form.setValue("name", area.name);
		}
	}, [isEditing, area, form]);

	const onSubmit = (values: CreateAreaInput) => {
		if (isEditing && area) {
			updateArea(
				{ id: area._id, data: values },
				{
					onSuccess: () => {
						handleOpenChange(false);
						form.reset();
					},
				},
			);
		} else {
			createArea(values, {
				onSuccess: () => {
					handleOpenChange(false);
					form.reset();
				},
			});
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(val) => {
				handleOpenChange(val);
				if (!val) form.reset();
			}}
		>
			<DialogTrigger asChild>
				{trigger || (
					<Button className="gap-2">
						<Plus className="h-4 w-4" /> Add Area
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{isEditing ? "Edit Area" : "Add New Area"}</DialogTitle>
					<DialogDescription>
						Provide the area name to add it to the system.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Area Name *</FieldLabel>
									<Input {...field} placeholder="e.g. Dhanmondi" />
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>

					<div className="flex justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending} className="min-w-24">
							{isPending ? (
								<>
									<Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving...
								</>
							) : isEditing ? (
								"Update Area"
							) : (
								"Save Area"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
