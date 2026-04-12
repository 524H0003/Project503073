import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DetailedHTMLProps, InputHTMLAttributes, useId } from "react";

export type PropsInputField = {
	invalid?: boolean;
	desc?: string;
	label: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function InputField({
	invalid = false,
	desc = "",
	label,
	onChange,
	...props
}: PropsInputField) {
	const id = useId();

	return (
		<Field data-invalid={invalid}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Input onChange={onChange} id={id} aria-invalid={invalid} {...props} />
			{desc && (
				<FieldDescription className={cn(invalid && "text-destructive")}>
					{desc}
				</FieldDescription>
			)}
		</Field>
	);
}
