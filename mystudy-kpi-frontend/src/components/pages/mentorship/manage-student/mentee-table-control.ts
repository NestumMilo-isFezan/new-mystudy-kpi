import type { TableControlConfig } from "@/components/table/core/table-config";

export const getMenteeTableControlConfig = (): TableControlConfig => {
	return {
		query: {
			placeholder: "Search by name, ID, or email...",
			desktopColumns: ["identifier", "fullName", "email"],
			mobileColumns: ["identifier", "fullName"],
		},
		filters: [],
		sortOptions: [
			{ columnId: "identifier", label: "Student ID" },
			{ columnId: "fullName", label: "Full Name" },
			{ columnId: "email", label: "Email" },
		],
		columns: [
			{ columnId: "identifier", label: "ID", hideable: false },
			{ columnId: "fullName", label: "Full Name", hideable: true },
			{ columnId: "email", label: "Email", hideable: true },
			{ columnId: "actions", label: "Actions", hideable: false },
		],
	};
};
