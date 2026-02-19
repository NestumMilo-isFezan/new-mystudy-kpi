import { SearchIcon } from "lucide-react";
import { useTableContext } from "@/components/table/core/table-control";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

export function InputQuery({ className }: { className?: string }) {
	const { config, query, setQuery } = useTableContext();

	return (
		<InputGroup className={className}>
			<InputGroupAddon>
				<SearchIcon className="size-4" />
			</InputGroupAddon>
			<InputGroupInput
				placeholder={config.query.placeholder}
				value={query}
				onChange={(event) => setQuery(event.target.value)}
			/>
		</InputGroup>
	);
}
