import {
	type Control,
	type FieldArrayWithId,
	type UseFieldArrayRemove,
	type UseFormRegister,
} from "react-hook-form";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import type { MukTypeInput } from "@/model/muk-model";
import { useState } from "react";

export default function UnitField({
	unitFields,
	unitIndex,
	groupIndex,
	useForm,
	removeUnit,
	disabled = false,
}: {
	unitFields: FieldArrayWithId<
		MukTypeInput,
		`groups_ia02.${number}.units`,
		"id"
	>[];
	unitIndex: number;
	groupIndex: number;
	useForm: {
		control: Control<MukTypeInput>;
		register: UseFormRegister<MukTypeInput>;
	};
	removeUnit: UseFieldArrayRemove;
	disabled?: boolean;
}) {
	const { register } = useForm;
	const field = unitFields[unitIndex];

	const [openValueIA01, setOpenValueIA01] = useState<string | undefined>(
		undefined
	);

	return (
		<div
			key={field.id}
			style={{
				border: "1px solid #ccc",
				borderRadius: 6,
				padding: "1em",
				marginBottom: "1em",
				width: "100%",
			}}
		>
			<Accordion
				type="single"
				collapsible
				value={openValueIA01}
				onValueChange={setOpenValueIA01}
				className="w-full"
			>
				<AccordionItem value="item-1">
					<div className="flex justify-between items-center w-full">
						<AccordionTrigger>
							<h2 className="text-md font-semibold">
								Unit Kompetensi {unitIndex + 1}
							</h2>
						</AccordionTrigger>
						<button
							type="button"
							onClick={() => removeUnit(unitIndex)}
							className="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
							disabled={disabled}
						>
							Hapus Unit
						</button>
					</div>
					<AccordionContent>
						<>
							<div style={{ display: "flex", gap: "1em", marginBottom: "1em" }}>
								<div style={{ flex: 1 }}>
									<label>
										Kode Unit
										<input
											{...register(
												`groups_ia02.${groupIndex}.units.${unitIndex}.unit_code`
											)}
											style={{
												width: "100%",
												padding: "0.5em",
												marginTop: "0.25em",
											}}
											className="w-full px-3 py-2 border rounded-md border-gray-300"
											disabled={disabled}
										/>
									</label>
								</div>
								<div style={{ flex: 1 }}>
									<label>
										Judul Unit
										<input
											{...register(
												`groups_ia02.${groupIndex}.units.${unitIndex}.title`
											)}
											style={{
												width: "100%",
												padding: "0.5em",
												marginTop: "0.25em",
											}}
											className="w-full px-3 py-2 border rounded-md border-gray-300"
											disabled={disabled}
										/>
									</label>
								</div>
							</div>
						</>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}

