import { Minus, Plus } from "lucide-react";
import type * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";

export interface NumberInputProps
	extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
	value?: number;
	defaultValue?: number;
	onChange?: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	variant?: "int" | "float";
}

export function NumberInput({
	value,
	defaultValue,
	onChange,
	min,
	max,
	step = 1,
	variant = "int",
	className,
	disabled,
	...props
}: NumberInputProps) {
	const [internalValue, setInternalValue] = useState<number>(
		value ?? defaultValue ?? 0,
	);

	useEffect(() => {
		if (value !== undefined) {
			setInternalValue(value);
		}
	}, [value]);

	const handleChange = useCallback(
		(nextValue: number) => {
			let sanitizedValue = nextValue;

			if (variant === "float") {
				// Fix floating point precision issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
				// We round based on the step precision, or default to 2 decimal places
				const precision = step.toString().split(".")[1]?.length || 2;
				sanitizedValue = Number.parseFloat(nextValue.toFixed(precision));
			} else {
				sanitizedValue = Math.round(nextValue);
			}

			if (min !== undefined) sanitizedValue = Math.max(min, sanitizedValue);
			if (max !== undefined) sanitizedValue = Math.min(max, sanitizedValue);

			if (value === undefined) {
				setInternalValue(sanitizedValue);
			}
			onChange?.(sanitizedValue);
		},
		[min, max, onChange, value, variant, step],
	);

	const increment = () => handleChange(internalValue + step);
	const decrement = () => handleChange(internalValue - step);

	return (
		<InputGroup className={className}>
			<InputGroupAddon align="inline-start">
				<InputGroupButton
					size="icon-xs"
					onClick={decrement}
					disabled={disabled || (min !== undefined && internalValue <= min)}
					aria-label="Decrement"
				>
					<Minus />
				</InputGroupButton>
			</InputGroupAddon>
			<InputGroupInput
				type="number"
				value={internalValue}
				onChange={(e) => {
					const val =
						variant === "float"
							? Number.parseFloat(e.target.value)
							: Number.parseInt(e.target.value, 10);
					if (!Number.isNaN(val)) {
						handleChange(val);
					}
				}}
				min={min}
				max={max}
				step={step}
				disabled={disabled}
				className="text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
				{...props}
			/>
			<InputGroupAddon align="inline-end">
				<InputGroupButton
					size="icon-xs"
					onClick={increment}
					disabled={disabled || (max !== undefined && internalValue >= max)}
					aria-label="Increment"
				>
					<Plus />
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
}
