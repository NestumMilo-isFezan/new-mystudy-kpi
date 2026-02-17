import Header from "@/components/header";

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-svh">
			<Header />
			{children}
		</div>
	);
}
