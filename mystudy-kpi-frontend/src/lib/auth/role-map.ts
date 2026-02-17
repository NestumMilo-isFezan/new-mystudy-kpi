export type AppRole = "student" | "lecturer" | "staff";

export function mapRole(roleValue: number): AppRole {
	if (roleValue === 2) {
		return "staff";
	}

	if (roleValue === 1) {
		return "lecturer";
	}

	return "student";
}
