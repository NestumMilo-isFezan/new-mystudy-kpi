import type { Challenge } from "@/lib/api/challenges-query";

type LecturerChallengeActionGroupProps = {
	record: Challenge;
	variant: "card" | "cell";
};

/**
 * Lecturer action group for challenges.
 * Currently, lecturers can only view challenges.
 */
export function LecturerChallengeActionGroup({
	record: _record,
	variant: _variant,
}: LecturerChallengeActionGroupProps) {
	return null;
}
