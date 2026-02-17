import type { ReactNode } from "react";

export default function AuthPageShell({ children }: { children: ReactNode }) {
	return (
		<main className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 pt-20 md:p-10">
			<div className="w-full max-w-sm md:max-w-5xl">{children}</div>
		</main>
	);
}
