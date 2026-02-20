import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAssignStudentContext } from "./provider";

export function LecturerSelector() {
	const {
		showLecturerSelector,
		selectedLecturerId,
		lecturers,
		onLecturerChange,
	} = useAssignStudentContext();

	if (!showLecturerSelector) {
		return null;
	}

	const selectedLecturer = lecturers.find(
		(lecturer) => lecturer.id === selectedLecturerId,
	);

	return (
		<div className="space-y-2">
			<Label className="text-sm font-medium">Lecturer</Label>
			<Select value={selectedLecturerId} onValueChange={onLecturerChange}>
				<SelectTrigger>
					<SelectValue placeholder="Select Lecturer">
						{selectedLecturer
							? `${selectedLecturer.firstName ?? ""} ${selectedLecturer.lastName ?? ""}`.trim()
							: undefined}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{lecturers.map((lecturer) => (
						<SelectItem key={lecturer.id} value={lecturer.id}>
							{lecturer.firstName} {lecturer.lastName}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
