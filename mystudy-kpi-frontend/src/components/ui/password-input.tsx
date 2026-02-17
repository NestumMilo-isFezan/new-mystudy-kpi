import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";

function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
	const [isVisible, setIsVisible] = React.useState(false);

	return (
		<InputGroup className={className}>
			<InputGroupInput
				type={isVisible ? "text" : "password"}
				autoComplete="current-password"
				{...props}
			/>
			<InputGroupAddon align="inline-end">
				<InputGroupButton
					type="button"
					variant="ghost"
					size="xs"
					tabIndex={-1}
					onClick={() => setIsVisible((visible) => !visible)}
					aria-label={isVisible ? "Hide password" : "Show password"}
				>
					{isVisible ? (
						<EyeOffIcon aria-hidden="true" />
					) : (
						<EyeIcon aria-hidden="true" />
					)}
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
}

export { PasswordInput };
