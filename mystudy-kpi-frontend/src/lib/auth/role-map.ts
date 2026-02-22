export type AppRole = "student" | "lecturer" | "staff";

export function mapRole(roleValue: number): AppRole | null {
	if (roleValue === 2) {
		return "staff";
	}

	if (roleValue === 1) {
		return "lecturer";
	}

	if (roleValue === 0) {
		return "student";
	}

	return null;
}
