import { Link } from "@tanstack/react-router";
import { Home, LogIn, LogOut, UserPlus, UserRound } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { useLogoutAndRedirect } from "@/lib/auth/use-logout-and-redirect";
import { cn } from "@/lib/utils";

const baseNavClass =
	"flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground";

const activeNavClass = "bg-primary text-primary-foreground hover:bg-primary/90";

export default function Header() {
	return (
		<header className="flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 text-foreground shadow-sm backdrop-blur">
			<h1>
				<Link to="/" className="flex items-center gap-3 rounded-md px-1 py-1">
					<span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-xs font-black text-primary-foreground">
						MK
					</span>
					<span className="text-sm font-semibold tracking-wide text-foreground md:text-base">
						MyStudy KPI
					</span>
				</Link>
			</h1>

			<AuthNav />
		</header>
	);
}

function AuthNav() {
	const { session, isPending } = useAuth();
	const { logoutAndRedirect, isPending: isLogoutPending } =
		useLogoutAndRedirect();

	return (
		<nav className="flex items-center gap-2">
			<Link
				to="/"
				className={baseNavClass}
				activeProps={{ className: cn(baseNavClass, activeNavClass) }}
			>
				<Home size={16} />
				<span>Home</span>
			</Link>

			{isPending ? (
				<span className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
					Loading...
				</span>
			) : session ? (
				<>
					<Link
						to="/dashboard"
						className={baseNavClass}
						activeProps={{ className: cn(baseNavClass, activeNavClass) }}
					>
						<UserRound size={16} />
						<span>Dashboard</span>
					</Link>
					<Link
						to="/profile"
						className={baseNavClass}
						activeProps={{ className: cn(baseNavClass, activeNavClass) }}
					>
						<UserRound size={16} />
						<span>Profile</span>
					</Link>
					<button
						type="button"
						onClick={logoutAndRedirect}
						disabled={isLogoutPending}
						className={cn(
							"flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
							"disabled:cursor-not-allowed disabled:opacity-60",
						)}
					>
						<LogOut size={16} />
						<span>{isLogoutPending ? "Logging out..." : "Logout"}</span>
					</button>
				</>
			) : (
				<GuestActions />
			)}
		</nav>
	);
}

function GuestActions() {
	return (
		<>
			<Link
				to="/login"
				className={baseNavClass}
				activeProps={{ className: cn(baseNavClass, activeNavClass) }}
			>
				<LogIn size={16} />
				<span>Login</span>
			</Link>
			<Link
				to="/register"
				className={baseNavClass}
				activeProps={{ className: cn(baseNavClass, activeNavClass) }}
			>
				<UserPlus size={16} />
				<span>Register</span>
			</Link>
		</>
	);
}
