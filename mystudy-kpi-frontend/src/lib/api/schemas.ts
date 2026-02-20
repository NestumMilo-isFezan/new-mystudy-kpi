import { z } from "zod";

export const positiveIntSchema = z.number().int().positive();
export const uuidSchema = z.string().uuid();

export const levelTargetsSchema = z.object({
	faculty: z.number().int().min(0),
	university: z.number().int().min(0),
	local: z.number().int().min(0),
	national: z.number().int().min(0),
	international: z.number().int().min(0),
});

export const certificateTargetsSchema = z.object({
	professional: z.number().int().min(0),
	technical: z.number().int().min(0),
});

export const saveKpiAimPayloadSchema = z.object({
	cgpa: z
		.string()
		.regex(
			/^(?:[0-3](?:\.\d{1,2})?|4(?:\.0{1,2})?)$/,
			"CGPA must be between 0.00 and 4.00",
		),
	activities: levelTargetsSchema,
	competitions: levelTargetsSchema,
	certificates: certificateTargetsSchema,
});
