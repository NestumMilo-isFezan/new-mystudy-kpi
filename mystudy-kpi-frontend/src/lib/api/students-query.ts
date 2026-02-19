import { queryOptions } from "@tanstack/react-query";
import { getAllStudentsFn } from "./students.functions";

export const allStudentsQueryOptions = queryOptions({
	queryKey: ["students", "all"],
	queryFn: () => getAllStudentsFn(),
});
