// TambahMUK.tsx
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import mammoth from "mammoth";
import { ChevronDown, Filter, Upload } from "lucide-react";
import Sidebar from "@/components/SideAdmin";
import Navbar from "@/components/NavAdmin";
import type { Element, SkemaType, Unit } from "@/lib/types";
import UnitField from "@/components/UnitField";

const defaultValues: SkemaType = {
  jurusan: "",
  pilihSkema: "",
  pilihCluster: "",
  nomorSKM: "",
  unit: [
    {
      kode: "",
      judul: "",
      elemen: [{ id: "", text: "", item: [{ id: "", text: "" }] }],
    },
  ],
};

const TambahMUK: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SkemaType>({ defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "unit",
  });

  const pilihSkema = watch("pilihSkema");
  const pilihCluster = watch("pilihCluster");

  async function handleUploadDocx(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const html = await extractDocxText(file);
      const parsedData = parseHTMLToSchema(html);

      // reset form tapi biarkan pilihSkema/pilihCluster kosong agar user pilih manual
      reset({
        ...defaultValues,
        ...parsedData,
        pilihSkema: "",
        pilihCluster: "",
      });
    } catch (err) {
      console.error("Gagal parse docx:", err);
      alert("Gagal membaca file .docx. Pastikan dokumen memiliki tabel unit/elemen yang benar.");
    }
  }

  const onSubmit = (data: SkemaType) => {
    // di sini kirim ke API
    console.log("Submit data:", data);
    alert("Simpan MUK (lihat console untuk data)");
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-gray-500">Kelola Database &rarr; Tambah MUK</div>

          {/* Card container mirip contoh KelolaMUK */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Tambah Kelengkapan MUK</h1>
                  <p className="text-sm text-gray-500 mt-1">Isi data unit dan elemen, atau import dari .docx</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => console.log("filter")}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E77D35] rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Filter size={16} className="text-[#E77D35]" /> Filter
                  </button>
                  <button
                    type="button"
                    onClick={() => console.log("export")}
                    className="bg-[#E77D35] text-white rounded-md text-sm px-4 py-2 hover:bg-orange-600 transition-colors"
                  >
                    Export ke Excel
                  </button>
                </div>
              </div>

              {/* full border line */}
              <div className="border-b border-gray-200 mt-6" />
            </div>

            {/* Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Skema & Cluster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Skema</label>
                    
                    <div className="relative w-full">
                      <select
                        {...register("pilihSkema", { required: "Pilih Skema wajib diisi" })}
                        className={`w-full px-3 py-2 border rounded-md appearance-none ${errors.pilihSkema ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="">Pilih Skema</option>
                        <option value="skema1">Skema 1</option>
                        <option value="skema2">Skema 2</option>
                      </select>
                      <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                    </div>
                    {errors.pilihSkema && <p className="text-xs text-red-500 mt-1">{errors.pilihSkema.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Cluster</label>
                    <div className="relative w-full">
                      <select
                        {...register("pilihCluster", { required: "Pilih Cluster wajib diisi" })}
                        className={`w-full px-3 py-2 border rounded-md appearance-none ${errors.pilihCluster ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="">Pilih Cluster</option>
                        <option value="cluster1">Cluster 1</option>
                        <option value="cluster2">Cluster 2</option>
                      </select>
                      <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                    </div>
                    {errors.pilihCluster && <p className="text-xs text-red-500 mt-1">{errors.pilihCluster.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor SKM (Otomatis terisi)
                    </label>
                    <input
                      {...register("nomorSKM")}
                      type="text"
                      readOnly
                      placeholder={`SKM.${watch("pilihSkema")}.${watch("pilihCluster")}/LSPSMK24/${new Date().getFullYear()}`}
                      className="w-full px-3 py-2 border rounded-md border-gray-300"
                    />
                  </div>
                </div>

                {/* NOTE: Judul & Nomor Skema TIDAK DITAMPILKAN sesuai request */}

                {/* Units */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Units</h2>
                  </div>

                  <div className="space-y-4">
                        {fields.map((_field, unitIndex) => (
                      <div key={_field.id}>

                          <UnitField
                            unitFields={fields}
                            useForm={{ control, register }}
                            removeUnit={remove}
                            unitIndex={unitIndex}
                            key={_field.id}
                          />

                        {/* Tombol remove unit */}
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => remove(unitIndex)}
                            className="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                          >
                            Remove Unit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() =>
                        append({
                          kode: "",
                          judul: "",
                          elemen: [{ id: "", text: "", item: [{ id: "", text: "" }] }],
                        })
                      }
                      className="bg-[#E77D35] text-white px-4 py-2 rounded-md hover:opacity-95 transition-colors"
                    >
                      Tambah Unit
                    </button>
                  </div>
                </div>

                {/* Import .docx */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Import dari .docx (opsional)</label>
                  <label className="inline-flex items-center gap-2 bg-[#E77D35] text-white px-4 py-2 rounded-md cursor-pointer">
                    <Upload size={16} />
                    Pilih File .docx
                    <input type="file" accept=".docx" onChange={handleUploadDocx} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">File harus berisi tabel unit + elemen agar bisa diparse otomatis.</p>
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#E77D35] text-white py-3 rounded-md font-semibold hover:opacity-95 transition-colors"
                  >
                    Simpan MUK
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

async function extractDocxText(file: File) {
	const arrayBuffer = await file.arrayBuffer();
	const result = await mammoth.convertToHtml({ arrayBuffer });
	return result.value;
}

export function parseHTMLToSchema(html: string): SkemaType {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

  console.log(doc);
	const tables = Array.from(doc.querySelectorAll("table"));
	console.log(tables);
	if (tables.length === 0)
		throw new Error("Tidak ada tabel ditemukan dalam dokumen.");

	let jurusan = "";
	let judulSkema = "";
	let nomorSkema = "";
	const units: Unit[] = [];

	let currentUnit: Unit | null = null;
	let currentElemen: Element | null = null;
	let elemenCounter = 1;
	let itemCounter = 1;

	for (const table of tables) {
		const rows = Array.from(table.querySelectorAll("tr"));

		for (const row of rows) {
			const text = row.innerText.trim();
			const cells = Array.from(row.querySelectorAll("td")).map((td) =>
				td.innerText.trim()
			);

			if (text.includes("Nomor:")) {
				nomorSkema = cells[2] || "";
				continue;
			}

			if (text.includes("Kode Unit")) {
				const kodeMatch = text.match(/Kode Unit\s*:?\s*(.+)/);
				const kode =
					kodeMatch?.[1]?.trim() || cells[1]?.replace(":", "").trim() || "";
				currentUnit = {
					kode,
					judul: "",
					elemen: [],
				};
				continue;
			}

			if (text.includes("Judul Unit")) {
				const judulMatch = text.match(/Judul Unit\s*:?\s*(.+)/);
				const judul =
					judulMatch?.[1]?.trim() || cells[1]?.replace(":", "").trim() || "";
				if (currentUnit) {
					currentUnit.judul = judul;
					units.push(currentUnit);
					currentUnit = null;
				}
				continue;
			}

			if (text.match(/Elemen\s*\d+\s*:/)) {
				const match = text.match(/Elemen\s*(\d+)\s*:\s*(.*)/);
				const id = match?.[1] || `${elemenCounter}`;
				const elemenText = match?.[2]?.trim() || `Elemen ${elemenCounter}`;
				const ol = row.querySelector("ol");
				const items = ol
					? Array.from(ol.querySelectorAll("li")).map((li, i) => ({
							id: `${elemenCounter}.${i + 1}`,
							text: li.textContent?.trim() || "",
					  }))
					: [];

				currentElemen = {
					id,
					text: elemenText,
					item: items,
				};
				if (units.length > 0) {
					units[units.length - 1].elemen.push(currentElemen);
				}
				elemenCounter++;
				itemCounter = 1;
				continue;
			}
		}
	}

	const filteredUnits = units.filter((unit) => unit.elemen.length > 0);

	return {
		jurusan,
		pilihSkema: judulSkema,
    pilihCluster: "",
		nomorSKM: nomorSkema,
		unit: filteredUnits,
	};
}

export default TambahMUK;
