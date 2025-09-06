import type { MukTypeInput } from "@/lib/types";
import {
	useFieldArray,
	type Control,
	type FieldArrayWithId,
	type UseFieldArrayRemove,
	type UseFormRegister,
} from "react-hook-form";

export default function ElementField({
	elementFields,
	unitIndex,
	elementIndex,
	useForm,
	removeElement,
	disabled = false,
}: {
	elementFields: FieldArrayWithId<
		MukTypeInput,
		`uc_apl02s.${number}.elements`,
		"id"
	>[];
	unitIndex: number;
	elementIndex: number;
	useForm: {
		control: Control<MukTypeInput>;
		register: UseFormRegister<MukTypeInput>;
	};
	removeElement: UseFieldArrayRemove;
	disabled?: boolean;
}) {
	const { control, register } = useForm;
	const elementField = elementFields[elementIndex];

	const {
		fields: itemFields,
		append: appendItem,
		remove: removeItem,
	} = useFieldArray({
		control,
		name: `uc_apl02s.${unitIndex}.elements.${elementIndex}.details`,
	});

	return (
		<div
			key={elementField.id}
			style={{
				borderRadius: 6,
				padding: "1em",
				marginBottom: "1em",
				border: "1px solid #ddd",
				width: "100%",
			}}
		>
			<div className="flex justify-between">
				<h3 className="text-md font-semibold" style={{ marginBottom: "0.5em" }}>
					Elemen {elementIndex + 1}
				</h3>
				<button
					type="button"
					onClick={() => removeElement(elementIndex)}
					className="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
					disabled={disabled}
				>
					Hapus Elemen
				</button>
			</div>

			<div style={{ marginBottom: "1em" }}>
				<label>
					Deskripsi Elemen
					<input
						{...register(
							`uc_apl02s.${unitIndex}.elements.${elementIndex}.title`
						)}
						style={{ width: "100%", padding: "0.5em", marginTop: "0.25em" }}
						className="w-full px-3 py-2 border rounded-md border-gray-300"
						disabled={disabled}
					/>
				</label>
			</div>

			{itemFields.map((itemField, itemIndex) => (
				<div
					key={itemField.id}
					style={{ display: "flex", gap: "1em", marginBottom: "1em" }}
				>
					<label style={{ flex: 1 }}>
						Deskripsi Item {elementIndex + 1}.{itemIndex + 1}
						<div style={{ display: "flex", flexDirection: "row", gap: "1em" }}>
							<input
								{...register(
									`uc_apl02s.${unitIndex}.elements.${elementIndex}.details.${itemIndex}.description`
								)}
								style={{ width: "100%", padding: "0.5em", marginTop: "0.25em" }}
								className="w-full px-3 py-2 border rounded-md border-gray-300"
								disabled={disabled}
							/>
							<button
								type="button"
								style={{
									color: "red",
									textWrap: "nowrap",
									marginTop: "0.25em",
								}}
								className="px-3 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
								onClick={() => removeItem(itemIndex)}
								disabled={disabled}
							>
								Hapus Item
							</button>
						</div>
					</label>
				</div>
			))}

			<div style={{ display: "flex", gap: "0.5em" }}>
				<button
					type="button"
					onClick={() => appendItem({ id: "", description: "" })}
					className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors"
					disabled={disabled}
				>
					Tambah Item
				</button>
			</div>
		</div>
	);
}
