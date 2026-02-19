import { GraduationCap, Plus } from "lucide-react";
import { useCallback } from "react";
import { StudentCreateForm } from "@/components/pages/manage-student/student-create-form";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useModal } from "@/hooks/use-modal";

export function StudentHeader() {
	const modal = useModal();

	const handleCreate = useCallback(() => {
		modal.open({
			title: "Register New Student",
			description:
				"Create a new student account. They will be assigned to the selected intake batch.",
			Content: StudentCreateForm,
			payload: {},
		});
	}, [modal]);

	return (
		<Heading
			title="Manage Students"
			description="Register and manage student accounts in the system."
			icon={GraduationCap}
		>
			<Button type="button" onClick={handleCreate} className="w-full md:w-auto">
				<Plus className="mr-2 size-4" />
				Register Student
			</Button>
		</Heading>
	);
}
