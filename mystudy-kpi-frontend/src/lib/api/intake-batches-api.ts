import { getRequest } from "./http-client";

export type IntakeBatch = {
	id: number;
	name: string;
	isActive: boolean;
};

export function getIntakeBatches() {
	return getRequest<IntakeBatch[]>("/api/intake-batches");
}
