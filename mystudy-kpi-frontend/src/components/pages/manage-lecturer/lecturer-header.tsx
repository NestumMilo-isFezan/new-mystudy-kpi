import { Plus, Users } from "lucide-react";
import { useCallback } from "react";
import { LecturerCreateForm } from "@/components/pages/manage-lecturer/lecturer-create-form";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useModal } from "@/hooks/use-modal";

export function LecturerHeader() {
	const modal = useModal();

	const handleCreate = useCallback(() => {
		modal.open({
			title: "Register New Lecturer",
			description:
				"Create a new lecturer account. They will be able to log in with their ID or email.",
			Content: LecturerCreateForm,
			payload: {},
		});
	}, [modal]);

	return (
		<Heading
			title="Manage Lecturers"
			description="Register and manage lecturer accounts in the system."
			icon={Users}
		>
			<Button type="button" onClick={handleCreate} className="w-full md:w-auto">
				<Plus className="mr-2 size-4" />
				Register Lecturer
			</Button>
		</Heading>
	);
}
