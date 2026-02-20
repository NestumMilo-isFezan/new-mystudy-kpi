import { useQuery } from "@tanstack/react-query";
import { type LinkProps, useNavigate } from "@tanstack/react-router";
import {
	createContext,
	type ReactNode,
	useContext,
	useMemo,
	useState,
} from "react";
import { MentorshipStudentCreateForm } from "@/components/pages/mentorship/mentorship-student-create-form";
import { useMentorshipMutations } from "@/components/pages/mentorship/use-mentorship-mutations";
import { useModal } from "@/hooks/use-modal";
import { intakeBatchesQueryOptions } from "@/lib/api/intake-batches-query";
import { allLecturersQueryOptions } from "@/lib/api/lecturers-query";
import {
	availableStudentsAdminQueryOptions,
	availableStudentsQueryOptions,
} from "@/lib/api/mentorships-query";

export type StudentOption = {
	id: string;
	identifier: string;
	firstName: string | null;
	lastName: string | null;
	email: string;
};

export type LecturerOption = {
	id: string;
	firstName?: string | null;
	lastName?: string | null;
};

type AssignStudentContextValue = {
	selectedBatchId: number;
	lockedBatchId?: number;
	showLecturerSelector: boolean;
	selectedLecturerId: string;
	lecturers: LecturerOption[];
	isLoadingStudents: boolean;
	filteredStudents: StudentOption[];
	selectedStudentIds: Set<string>;
	searchQuery: string;
	selectedCount: number;
	isAssignDisabled: boolean;
	isPending: boolean;
	onSearchChange: (value: string) => void;
	onSelectAll: () => void;
	onToggleStudent: (id: string) => void;
	onLecturerChange: (value: string | null) => void;
	onBatchChange: (value: number) => void;
	onCreateStudent: () => void;
	onAssign: () => void;
};

type AssignStudentProviderProps = {
	lockedBatchId?: number;
	returnMentorshipId?: number;
	showLecturerSelector?: boolean;
	rootPath: LinkProps["to"];
	children: ReactNode;
};

const AssignStudentContext = createContext<AssignStudentContextValue | null>(
	null,
);

export function useAssignStudentContext() {
	const context = useContext(AssignStudentContext);
	if (!context) {
		throw new Error(
			"useAssignStudentContext must be used within AssignStudentProvider",
		);
	}
	return context;
}

export function AssignStudentProvider({
	lockedBatchId,
	returnMentorshipId,
	showLecturerSelector = false,
	rootPath,
	children,
}: AssignStudentProviderProps) {
	const navigate = useNavigate();
	const modal = useModal();
	const { assignMutation, assignAdminMutation } = useMentorshipMutations();

	const [selectedLecturerId, setSelectedLecturerId] = useState<string>("");
	const [batchSelectionId, setBatchSelectionId] = useState<number>(
		lockedBatchId ?? 0,
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(
		new Set(),
	);

	const { data: intakeBatches = [] } = useQuery(intakeBatchesQueryOptions);
	const fallbackBatchId = intakeBatches[0]?.id ?? 0;
	const selectedBatchId =
		lockedBatchId ??
		(batchSelectionId > 0 ? batchSelectionId : fallbackBatchId);

	const lecturerAvailableStudentsQuery = useQuery({
		...availableStudentsQueryOptions(selectedBatchId),
		enabled: !showLecturerSelector && selectedBatchId > 0,
	});
	const adminAvailableStudentsQuery = useQuery({
		...availableStudentsAdminQueryOptions(selectedBatchId),
		enabled: showLecturerSelector && selectedBatchId > 0,
	});

	const availableStudents = showLecturerSelector
		? (adminAvailableStudentsQuery.data ?? [])
		: (lecturerAvailableStudentsQuery.data ?? []);
	const isLoadingStudents = showLecturerSelector
		? adminAvailableStudentsQuery.isLoading
		: lecturerAvailableStudentsQuery.isLoading;

	const { data: lecturers = [] } = useQuery({
		...allLecturersQueryOptions,
		enabled: showLecturerSelector,
	});

	const selectableStudentIds = useMemo(
		() => new Set(availableStudents.map((student) => student.id)),
		[availableStudents],
	);

	const selectedStudents = useMemo(
		() =>
			Array.from(selectedStudentIds).filter((studentId) =>
				selectableStudentIds.has(studentId),
			),
		[selectedStudentIds, selectableStudentIds],
	);

	const filteredStudents = useMemo(() => {
		if (!searchQuery) return availableStudents;
		const query = searchQuery.toLowerCase();
		return availableStudents.filter(
			(student) =>
				student.identifier.toLowerCase().includes(query) ||
				(student.firstName ?? "").toLowerCase().includes(query) ||
				(student.lastName ?? "").toLowerCase().includes(query) ||
				student.email.toLowerCase().includes(query),
		);
	}, [availableStudents, searchQuery]);

	const handleToggleStudent = (id: string) => {
		const next = new Set(selectedStudentIds);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		setSelectedStudentIds(next);
	};

	const handleSelectAll = () => {
		if (
			selectedStudents.length === filteredStudents.length &&
			filteredStudents.length > 0
		) {
			setSelectedStudentIds(new Set());
		} else {
			setSelectedStudentIds(
				new Set(filteredStudents.map((student) => student.id)),
			);
		}
	};

	const handleCreateStudent = () => {
		modal.open({
			title: "Register New Student",
			description:
				"Create a student account and assign them to a batch. They will then appear in the selection list.",
			Content: MentorshipStudentCreateForm,
			payload: {
				defaultBatchId: selectedBatchId > 0 ? selectedBatchId : undefined,
			},
		});
	};

	const handleAssign = () => {
		if (selectedBatchId === 0 || selectedStudents.length === 0) return;

		if (showLecturerSelector && !selectedLecturerId) {
			return;
		}

		if (showLecturerSelector) {
			assignAdminMutation.mutate(
				{
					batchId: selectedBatchId,
					studentIds: selectedStudents,
					lecturerId: selectedLecturerId,
				},
				{
					onSuccess: () => {
						if (returnMentorshipId) {
							navigate({
								to: `${rootPath as string}/${String(returnMentorshipId)}` as LinkProps["to"],
							});
							return;
						}

						navigate({ to: rootPath });
					},
				},
			);
		} else {
			assignMutation.mutate(
				{
					batchId: selectedBatchId,
					studentIds: selectedStudents,
				},
				{
					onSuccess: () => {
						if (returnMentorshipId) {
							navigate({
								to: `${rootPath as string}/${String(returnMentorshipId)}` as LinkProps["to"],
							});
							return;
						}

						navigate({ to: rootPath });
					},
				},
			);
		}
	};

	const isPending = assignMutation.isPending || assignAdminMutation.isPending;
	const isAssignDisabled =
		selectedBatchId === 0 ||
		selectedStudents.length === 0 ||
		isPending ||
		(showLecturerSelector && !selectedLecturerId);

	const handleBatchChange = (value: number) => {
		setBatchSelectionId(value);
		setSelectedStudentIds(new Set());
	};

	const handleLecturerChange = (value: string | null) => {
		setSelectedLecturerId(value ?? "");
	};

	const contextValue: AssignStudentContextValue = {
		selectedBatchId,
		lockedBatchId,
		showLecturerSelector,
		selectedLecturerId,
		lecturers,
		isLoadingStudents,
		filteredStudents,
		selectedStudentIds: new Set(selectedStudents),
		searchQuery,
		selectedCount: selectedStudents.length,
		isAssignDisabled,
		isPending,
		onSearchChange: setSearchQuery,
		onSelectAll: handleSelectAll,
		onToggleStudent: handleToggleStudent,
		onLecturerChange: handleLecturerChange,
		onBatchChange: handleBatchChange,
		onCreateStudent: handleCreateStudent,
		onAssign: handleAssign,
	};

	return (
		<AssignStudentContext.Provider value={contextValue}>
			{children}
		</AssignStudentContext.Provider>
	);
}
