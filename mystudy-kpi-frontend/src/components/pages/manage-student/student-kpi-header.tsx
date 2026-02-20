import {
	type UseSuspenseQueryOptions,
	useSuspenseQuery,
} from "@tanstack/react-query";
import {
	Link,
	type LinkProps,
	useLocation,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import {
	Award,
	ChevronLeft,
	GraduationCap,
	Target,
	Trophy,
	User2,
} from "lucide-react";
import { useCallback } from "react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StudentOverview } from "@/lib/api/students.functions";

type StudentKpiHeaderProps = {
	overviewQueryOptions: unknown;
	rootPath: string;
	backPath: string;
	backLabel: string;
};

export function StudentKpiHeader({
	overviewQueryOptions,
	rootPath,
	backPath,
	backLabel,
}: StudentKpiHeaderProps) {
	const { id } = useParams({ strict: false });
	const studentId = id ?? "";
	const location = useLocation();
	const navigate = useNavigate();

	const { data: overview } = useSuspenseQuery(
		overviewQueryOptions as UseSuspenseQueryOptions<StudentOverview>,
	);

	const handleBack = useCallback(() => {
		navigate({ to: backPath as LinkProps["to"] });
	}, [navigate, backPath]);

	const { student, actual, gaps } = overview;
	const batchName = student.intake?.name ?? "Unknown Batch";

	const totalActivities = Object.values(actual.activities).reduce(
		(a, b) => a + b,
		0,
	);
	const totalCompetitions = Object.values(actual.competitions).reduce(
		(a, b) => a + b,
		0,
	);
	const totalCerts = Object.values(actual.certificates).reduce(
		(a, b) => a + b,
		0,
	);

	const activeTab = location.pathname.includes("/academics")
		? "academics"
		: location.pathname.includes("/kpi-records")
			? "kpi-records"
			: location.pathname.includes("/challenges")
				? "challenges"
				: location.pathname.includes("/kpi-target")
					? "kpi-target"
					: "overview";

	return (
		<div className="space-y-8 py-6">
			<Heading
				title={`${student.firstName} ${student.lastName}`}
				description={`${student.identifier} • ${batchName}`}
				icon={User2}
			>
				<Button variant="outline" size="sm" onClick={handleBack}>
					<ChevronLeft className="mr-2 size-4" />
					{backLabel}
				</Button>
			</Heading>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<SummaryCard
					title="Current CGPA"
					value={
						actual.cgpa ? Number.parseFloat(actual.cgpa).toFixed(2) : "N/A"
					}
					description="Latest academic standing"
					icon={GraduationCap}
					trend={
						gaps.cgpa !== null
							? {
									value: `${gaps.cgpa >= 0 ? "+" : ""}${gaps.cgpa.toFixed(2)}`,
									isPositive: gaps.cgpa >= 0,
									label: "from target",
								}
							: undefined
					}
				/>
				<SummaryCard
					title="Total Records"
					value={totalActivities + totalCompetitions + totalCerts}
					description="Activities, competitions & certs"
					icon={Target}
				/>
				<SummaryCard
					title="Achievements"
					value={totalActivities + totalCompetitions}
					description="Events and competitions"
					icon={Trophy}
				/>
				<SummaryCard
					title="Certifications"
					value={totalCerts}
					description="Professional and technical"
					icon={Award}
				/>
			</div>

			<Tabs value={activeTab} className="w-full">
				<TabsList>
					<TabsTrigger
						value="overview"
						className="min-w-32 px-4"
						render={<Link to={`${rootPath}/${studentId}` as LinkProps["to"]} />}
					>
						Overview
					</TabsTrigger>
					<TabsTrigger
						value="academics"
						className="min-w-32 px-4"
						render={
							<Link
								to={`${rootPath}/${studentId}/academics` as LinkProps["to"]}
							/>
						}
					>
						Academics
					</TabsTrigger>
					<TabsTrigger
						value="kpi-records"
						className="min-w-32 px-4"
						render={
							<Link
								to={`${rootPath}/${studentId}/kpi-records` as LinkProps["to"]}
							/>
						}
					>
						KPI Records
					</TabsTrigger>
					<TabsTrigger
						value="challenges"
						className="min-w-32 px-4"
						render={
							<Link
								to={`${rootPath}/${studentId}/challenges` as LinkProps["to"]}
							/>
						}
					>
						Challenges
					</TabsTrigger>
					<TabsTrigger
						value="kpi-target"
						className="min-w-32 px-4"
						render={
							<Link
								to={`${rootPath}/${studentId}/kpi-target` as LinkProps["to"]}
							/>
						}
					>
						KPI Target
					</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);
}
