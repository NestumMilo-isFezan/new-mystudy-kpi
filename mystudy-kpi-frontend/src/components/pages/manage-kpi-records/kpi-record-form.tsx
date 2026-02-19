import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ModalContentProps } from "@/components/modal/modal-provider";
import { useKpiRecordMutations } from "@/components/pages/manage-kpi-records/use-kpi-record-mutations";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { academicsQueryOptions } from "@/lib/api/academics-query";
import type {
	KpiRecord,
	SaveKpiRecordPayload,
} from "@/lib/api/kpi-records.functions";

export function KpiRecordForm({
	close,
	payload,
}: ModalContentProps<KpiRecord | undefined>) {
	const { data: semesters } = useSuspenseQuery(academicsQueryOptions);
	const { createMutation, updateMutation } = useKpiRecordMutations();

	const isEditing = !!payload;

	const [formData, setFormData] = useState<SaveKpiRecordPayload>({
		semesterRecordId: payload?.semester.id || semesters[0]?.id,
		type: payload?.type || "activity",
		title: payload?.title || "",
		description: payload?.description || "",
		level: payload?.level ?? 0,
		category: payload?.category ?? 0,
		notes: payload?.notes || "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const successCallback = { onSuccess: () => close() };

		if (isEditing) {
			updateMutation.mutate(
				{ id: payload.id, payload: formData },
				successCallback,
			);
		} else {
			createMutation.mutate(formData, successCallback);
		}
	};

	const kpiTypes = [
		{ value: "activity", label: "Activity" },
		{ value: "competition", label: "Competition" },
		{ value: "certification", label: "Certification" },
	];

	const levels = [
		{ value: "0", label: "Faculty" },
		{ value: "1", label: "University" },
		{ value: "2", label: "Local" },
		{ value: "3", label: "National" },
		{ value: "4", label: "International" },
	];

	const categories = [
		{ value: "0", label: "Professional" },
		{ value: "1", label: "Technical" },
	];

	const selectedTypeLabel = kpiTypes.find(
		(type) => type.value === formData.type,
	)?.label;
	const selectedSemesterLabel = semesters.find(
		(semester) => semester.id === formData.semesterRecordId,
	)?.termString;
	const selectedLevelLabel = levels.find(
		(level) => level.value === formData.level?.toString(),
	)?.label;
	const selectedCategoryLabel = categories.find(
		(category) => category.value === formData.category?.toString(),
	)?.label;

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<Field>
					<FieldLabel>Type</FieldLabel>
					<FieldContent>
						<Select
							value={formData.type}
							onValueChange={(val) =>
								setFormData({ ...formData, type: val ?? "activity" })
							}
							disabled={isEditing}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select type">
									{selectedTypeLabel}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{kpiTypes.map((t) => (
									<SelectItem key={t.value} value={t.value}>
										{t.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FieldContent>
				</Field>

				<Field>
					<FieldLabel>Semester</FieldLabel>
					<FieldContent>
						<Select
							value={formData.semesterRecordId?.toString()}
							onValueChange={(val) =>
								setFormData({
									...formData,
									semesterRecordId: Number.parseInt(val ?? "0", 10),
								})
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select term">
									{selectedSemesterLabel}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{semesters.map((s) => (
									<SelectItem key={s.id} value={s.id.toString()}>
										{s.termString}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FieldContent>
				</Field>
			</div>

			<Field>
				<FieldLabel>Title</FieldLabel>
				<FieldContent>
					<Input
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						placeholder="e.g., Hackathon 2024"
						required
					/>
				</FieldContent>
			</Field>

			<Field>
				<FieldLabel>Description</FieldLabel>
				<FieldContent>
					<Textarea
						value={formData.description || ""}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
						placeholder="Optional details..."
					/>
				</FieldContent>
			</Field>

			{formData.type !== "certification" ? (
				<Field>
					<FieldLabel>Level</FieldLabel>
					<FieldContent>
						<Select
							value={formData.level?.toString()}
							onValueChange={(val) =>
								setFormData({
									...formData,
									level: Number.parseInt(val ?? "0", 10),
								})
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select level">
									{selectedLevelLabel}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{levels.map((l) => (
									<SelectItem key={l.value} value={l.value}>
										{l.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FieldContent>
				</Field>
			) : (
				<Field>
					<FieldLabel>Category</FieldLabel>
					<FieldContent>
						<Select
							value={formData.category?.toString()}
							onValueChange={(val) =>
								setFormData({
									...formData,
									category: Number.parseInt(val ?? "0", 10),
								})
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select category">
									{selectedCategoryLabel}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{categories.map((c) => (
									<SelectItem key={c.value} value={c.value}>
										{c.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FieldContent>
				</Field>
			)}

			<Field>
				<FieldLabel>Internal Notes</FieldLabel>
				<FieldContent>
					<Textarea
						value={formData.notes || ""}
						onChange={(e) =>
							setFormData({ ...formData, notes: e.target.value })
						}
						placeholder="Personal notes (not visible to others)..."
					/>
				</FieldContent>
			</Field>

			<DialogFooter>
				<Button type="button" variant="outline" onClick={close}>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={createMutation.isPending || updateMutation.isPending}
				>
					{isEditing ? "Update Record" : "Create Record"}
				</Button>
			</DialogFooter>
		</form>
	);
}
