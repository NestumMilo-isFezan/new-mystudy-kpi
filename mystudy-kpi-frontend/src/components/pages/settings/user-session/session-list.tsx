import { formatDistanceToNow } from "date-fns";
import { Globe, Laptop, Smartphone, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import {
	useRevokeSessionMutation,
	useUserSessionsSuspenseQuery,
} from "@/lib/auth/session-query";

export function SessionList() {
	const { data: sessions } = useUserSessionsSuspenseQuery();
	const revokeMutation = useRevokeSessionMutation();
	const modal = useModal();

	const getDeviceIcon = (userAgent: string | null) => {
		if (!userAgent) return <Globe className="h-5 w-5" />;
		const ua = userAgent.toLowerCase();
		if (
			ua.includes("mobi") ||
			ua.includes("android") ||
			ua.includes("iphone")
		) {
			return <Smartphone className="h-5 w-5" />;
		}
		return <Laptop className="h-5 w-5" />;
	};

	const parseUserAgent = (userAgent: string | null) => {
		if (!userAgent) return "Unknown Device";

		const ua = userAgent.toLowerCase();
		let browser = "Unknown Browser";
		let os = "Unknown OS";

		// Browser Detection (Order matters!)
		if (ua.includes("edg/")) browser = "Edge";
		else if (ua.includes("firefox")) browser = "Firefox";
		else if (ua.includes("opr/") || ua.includes("opera")) browser = "Opera";
		else if (ua.includes("chrome")) browser = "Chrome";
		else if (ua.includes("safari")) browser = "Safari";

		// OS Detection
		if (ua.includes("win")) os = "Windows";
		else if (ua.includes("mac os x")) os = "macOS";
		else if (ua.includes("linux")) os = "Linux";
		else if (ua.includes("android")) os = "Android";
		else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";

		// If we couldn't detect both, but have the raw string, show a snippet
		if (browser === "Unknown Browser" && os === "Unknown OS") {
			return userAgent.length > 30 ? `${userAgent.slice(0, 30)}...` : userAgent;
		}

		return `${browser} on ${os}`;
	};

	return (
		<div className="space-y-3">
			{sessions.map((session) => (
				<div
					key={session.id}
					className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
						session.is_current
							? "border-primary/30 bg-primary/5"
							: "border-border bg-card hover:bg-accent/5"
					}`}
				>
					<div className="flex items-center gap-4">
						<div
							className={`p-2.5 rounded-lg ${session.is_current ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
						>
							{getDeviceIcon(session.user_agent)}
						</div>
						<div className="grid gap-0.5">
							<div className="flex items-center gap-2">
								<span className="font-semibold text-sm">
									{parseUserAgent(session.user_agent)}
								</span>
								{session.is_current && (
									<span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
										Current
									</span>
								)}
							</div>
							<div className="text-xs text-muted-foreground flex items-center gap-2">
								<span>{session.ip_address}</span>
								<span className="size-1 rounded-full bg-border" />
								<SessionLastActiveLabel value={session.last_active_at} />
							</div>
						</div>
					</div>

					{!session.is_current && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => {
								modal.open({
									title: "Revoke Session",
									description:
										"Are you sure you want to revoke this session? You will be logged out from that device.",
									size: "sm",
									Content: ConfirmationModalContent,
									payload: {
										onConfirm: () => revokeMutation.mutate(session.id),
										confirmLabel: "Revoke",
										variant: "destructive",
										isPending: revokeMutation.isPending,
									},
								});
							}}
							disabled={revokeMutation.isPending}
							className="text-muted-foreground hover:text-destructive transition-colors"
							title="Revoke session"
						>
							<Trash2 className="size-5" />
						</Button>
					)}
				</div>
			))}
		</div>
	);
}

function SessionLastActiveLabel({ value }: { value: string | null }) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!value) {
		return <span>Never active</span>;
	}

	const parsedDate = new Date(value);
	const isValidDate = !Number.isNaN(parsedDate.getTime());

	if (!isClient || !isValidDate) {
		if (!isValidDate) {
			return <span>Active recently</span>;
		}

		return (
			<span>
				Active at {parsedDate.toISOString().slice(0, 16).replace("T", " ")} UTC
			</span>
		);
	}

	return (
		<span suppressHydrationWarning>
			Active {formatDistanceToNow(parsedDate, { addSuffix: true })}
		</span>
	);
}
