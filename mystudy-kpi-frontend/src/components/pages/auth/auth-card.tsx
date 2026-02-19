import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { IntakeBatch } from "@/lib/api/intake-batches.functions";
import { cn } from "@/lib/utils";

export type AuthFormValues = {
	identifier: string;
	email: string;
	password: string;
	confirmPassword: string;
	intakeBatchId: string;
};

interface AuthCardProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
	mode: "login" | "register";
	onSubmit: (values: AuthFormValues) => Promise<void>;
	isPending: boolean;
	intakeBatches?: IntakeBatch[];
	error?: string | null;
}

export function AuthCard({
	mode,
	onSubmit,
	isPending,
	intakeBatches,
	error,
	className,
	...props
}: AuthCardProps) {
	const backdropSource =
		"https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&h=1600&q=80";
	const form = useForm({
		defaultValues: {
			identifier: "",
			email: "",
			password: "",
			confirmPassword: "",
			intakeBatchId: "",
		} as AuthFormValues,
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:h-[640px] md:grid-cols-2">
					<form
						className="h-full overflow-y-auto p-6 md:p-8"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						<FieldGroup className="h-full justify-between">
							<div className="flex flex-col gap-7">
								<div className="flex flex-col items-center gap-2 text-center">
									<h1 className="text-2xl font-bold">
										{mode === "login" ? "Welcome back" : "Create account"}
									</h1>
									<p className="text-muted-foreground text-balance">
										{mode === "login"
											? "Login to your MyStudy KPI account"
											: "Register your student account to begin"}
									</p>
								</div>

								<form.Field name="identifier">
									{(field) => (
										<Field>
											<FieldLabel htmlFor={field.name}>
												{mode === "login"
													? "Identifier or Email"
													: "Identifier"}
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder={
													mode === "login"
														? "STD001 or student@example.com"
														: "STD001"
												}
												required
											/>
										</Field>
									)}
								</form.Field>

								{mode === "register" && (
									<form.Field name="email">
										{(field) => (
											<Field>
												<FieldLabel htmlFor={field.name}>Email</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													type="email"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="m@example.com"
													required
												/>
											</Field>
										)}
									</form.Field>
								)}

								{mode === "login" ? (
									<form.Field name="password">
										{(field) => (
											<Field>
												<FieldLabel htmlFor={field.name}>Password</FieldLabel>
												<PasswordInput
													id={field.name}
													name={field.name}
													placeholder="Enter your password"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													required
												/>
												<div className="text-right">
													<Link
														to="/"
														className="text-sm underline-offset-2 hover:underline"
													>
														Forgot your password?
													</Link>
												</div>
											</Field>
										)}
									</form.Field>
								) : (
									<div className="grid gap-4 md:grid-cols-2">
										<form.Field name="password">
											{(field) => (
												<Field>
													<FieldLabel htmlFor={field.name}>Password</FieldLabel>
													<PasswordInput
														id={field.name}
														name={field.name}
														placeholder="Enter your password"
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														required
													/>
												</Field>
											)}
										</form.Field>
										<form.Field name="confirmPassword">
											{(field) => (
												<Field>
													<FieldLabel htmlFor={field.name}>
														Confirm Password
													</FieldLabel>
													<PasswordInput
														id={field.name}
														name={field.name}
														placeholder="Re-enter your password"
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														required
													/>
												</Field>
											)}
										</form.Field>
									</div>
								)}

								{mode === "register" && (
									<form.Field name="intakeBatchId">
										{(field) => (
											<Field>
												<FieldLabel htmlFor={field.name}>
													Intake Batch
												</FieldLabel>
												<Select
													value={field.state.value}
													disabled={!intakeBatches?.length}
													onValueChange={(value) =>
														field.handleChange(value ?? "")
													}
												>
													<SelectTrigger id={field.name} className="w-full">
														<SelectValue
															placeholder={
																intakeBatches?.length
																	? "Select intake batch"
																	: "No intake batch available"
															}
														/>
													</SelectTrigger>
													<SelectContent>
														{intakeBatches?.length ? (
															intakeBatches.map((batch) => (
																<SelectItem
																	key={batch.id}
																	value={batch.id.toString()}
																>
																	{batch.name}
																</SelectItem>
															))
														) : (
															<SelectItem value="__no-intake__" disabled>
																No intake batch available
															</SelectItem>
														)}
													</SelectContent>
												</Select>
											</Field>
										)}
									</form.Field>
								)}

								{error && (
									<p className="bg-destructive/10 border-destructive/20 text-destructive rounded-lg border px-3 py-2 text-sm">
										{error}
									</p>
								)}
							</div>

							<div className="flex flex-col gap-4">
								<Button type="submit" className="w-full" disabled={isPending}>
									{isPending
										? mode === "login"
											? "Signing in..."
											: "Creating account..."
										: mode === "login"
											? "Login"
											: "Register"}
								</Button>
								<div className="text-center text-sm">
									{mode === "login" ? (
										<>
											Don&apos;t have an account?{" "}
											<Link
												to="/register"
												className="underline underline-offset-4"
											>
												Sign up
											</Link>
										</>
									) : (
										<>
											Already have an account?{" "}
											<Link
												to="/login"
												className="underline underline-offset-4"
											>
												Login
											</Link>
										</>
									)}
								</div>
							</div>
						</FieldGroup>
					</form>
					<div className="bg-muted relative hidden md:block">
						<img
							src={backdropSource}
							alt="Authentication backdrop"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
							loading="lazy"
						/>
					</div>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our{" "}
				<Link to="/">Terms of Service</Link> and{" "}
				<Link to="/">Privacy Policy</Link>.
			</FieldDescription>
		</div>
	);
}
