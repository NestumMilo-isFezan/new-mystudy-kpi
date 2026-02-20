import { createContext, useContext } from "react";

type MentorshipDetailContextValue = {
	menteeCount: number;
	isRemoving: boolean;
	onRemoveMentee: (studentId: string) => Promise<void>;
};

export const MentorshipDetailContext =
	createContext<MentorshipDetailContextValue | null>(null);

export function useMentorshipDetailContext() {
	return useContext(MentorshipDetailContext);
}
