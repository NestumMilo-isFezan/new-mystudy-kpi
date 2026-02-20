import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, UserPlus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

type MentorshipHeaderProps = {
	mode?: "index" | "assign" | "detail";
	onActionClick?: () => void;
	title?: string;
	description?: string;
	rootPath?: LinkProps["to"];
};

export function MentorshipHeader({
	mode = "index",
	onActionClick,
	title: customTitle,
	description: customDescription,
	rootPath = "/mentorship",
}: MentorshipHeaderProps) {
	const defaultTitle = mode === "assign" ? "Assign Students" : "My Mentees";
	const defaultDescription =
		mode === "assign"
			? "Select a batch and assign students to your mentorship."
			: "Manage students assigned to your mentorship sessions.";

	const title = customTitle || defaultTitle;
	const description = customDescription || defaultDescription;

	return (
		<Heading title={title} description={description} icon={GraduationCap}>
			<div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
				{mode === "index" && (
					<Link
						to={`${rootPath as string}/assign` as LinkProps["to"]}
						className={`${buttonVariants({ variant: "default" })} w-full md:w-auto`}
					>
						<UserPlus className="mr-2 size-4" />
						Assign Students
					</Link>
				)}

				{mode === "assign" && (
					<>
						<Link
							to={rootPath}
							className={`${buttonVariants({ variant: "outline" })} w-full md:w-auto`}
						>
							<ArrowLeft className="mr-2 size-4" />
							Back
						</Link>
						<button
							type="button"
							onClick={onActionClick}
							className={`${buttonVariants({ variant: "default" })} w-full md:w-auto`}
						>
							<UserPlus className="mr-2 size-4" />
							Register New Student
						</button>
					</>
				)}

				{mode === "detail" && (
					<>
						<Link
							to={rootPath}
							className={`${buttonVariants({ variant: "outline" })} w-full md:w-auto`}
						>
							<ArrowLeft className="mr-2 size-4" />
							Back
						</Link>
						<button
							type="button"
							onClick={onActionClick}
							className={`${buttonVariants({ variant: "default" })} w-full md:w-auto`}
						>
							<UserPlus className="mr-2 size-4" />
							Assign Student
						</button>
					</>
				)}
			</div>
		</Heading>
	);
}
