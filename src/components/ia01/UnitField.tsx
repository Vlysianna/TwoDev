import {
	useFieldArray,
	type Control,
	type FieldArrayWithId,
	type UseFieldArrayRemove,
	type UseFormRegister,
} from "react-hook-form";
import ElementField from "./ElementField";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import type { SkemaType } from "@/lib/types";
import { useState } from "react";

export default function UnitField({
	unitFields,
	unitIndex,
	groupIndex,
	useForm,
	removeUnit,
}: {
	unitFields: FieldArrayWithId<SkemaType, `groups_ia.${number}.units`, "id">[];
	unitIndex: number;
	groupIndex: number;
	useForm: {
		control: Control<SkemaType>;
		register: UseFormRegister<SkemaType>;
	};
	removeUnit: UseFieldArrayRemove;
}) {
	const { control, register } = useForm;
	const field = unitFields[unitIndex];

	const [openValueIA01, setOpenValueIA01] = useState<string | undefined>(
		undefined
	);

	const {
		fields: elementFields,
		append: appendElement,
		remove: removeElement,
	} = useFieldArray({
		control,
		name: `groups_ia.${groupIndex}.units.${unitIndex}.elements`,
	});

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
												`groups_ia.${groupIndex}.units.${unitIndex}.unit_code`
											)}
											style={{
												width: "100%",
												padding: "0.5em",
												marginTop: "0.25em",
											}}
											className="w-full px-3 py-2 border rounded-md border-gray-300"
										/>
									</label>
								</div>
								<div style={{ flex: 1 }}>
									<label>
										Judul Unit
										<input
											{...register(
												`groups_ia.${groupIndex}.units.${unitIndex}.title`
											)}
											style={{
												width: "100%",
												padding: "0.5em",
												marginTop: "0.25em",
											}}
											className="w-full px-3 py-2 border rounded-md border-gray-300"
										/>
									</label>
								</div>
							</div>

							{elementFields.map((_elementField, elementIndex) => (
								<div
									key={_elementField.id}
									style={{
										marginBottom: "1em",
									}}
								>
									<ElementField
										key={_elementField.id}
										elementFields={elementFields}
										useForm={{ control, register }}
										unitIndex={unitIndex}
										elementIndex={elementIndex}
										groupIndex={groupIndex}
										removeElement={removeElement}
									/>
								</div>
							))}
						</>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<div style={{ display: "flex", gap: "0.5em" }}>
				<button
					type="button"
					onClick={() => appendElement({ id: "", title: "", details: [] })}
					className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors"
				>
					Tambah Elemen
				</button>
			</div>
		</div>
	);
}
