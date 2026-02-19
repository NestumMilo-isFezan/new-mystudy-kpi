import { queryOptions } from "@tanstack/react-query";
import { getAllLecturersFn } from "./lecturers.functions";

export const allLecturersQueryOptions = queryOptions({
	queryKey: ["lecturers", "all"],
	queryFn: () => getAllLecturersFn(),
});
