import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../components/NavAdmin"
import Sidebar from "../../components/SideAdmin"
import axiosInstance from '@/helper/axios';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface SchemeData {
  code: string;
  name: string;
}

export default function TambahSkema() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SchemeData>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: SchemeData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

  const response = await axiosInstance.post('/schemes', data);
      
      if (response.data.success) {
        setSuccess('Skema berhasil ditambahkan!');
        reset();
      } else {
        setError(response.data.message || 'Gagal menambahkan skema');
      }
    } catch (error: unknown) {
      console.error('Error creating scheme:', error);
      setError('Gagal menambahkan skema');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed width dan fixed position */}
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0 md:ml-0">
        {/* Navbar - Sticky di atas */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <Navbar />
        </div>

        {/* Konten Utama */}
        <div className="p-6">
          <form
            className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="text-2xl font-bold">Tambah Skema</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Jurusan</label>
                <input {...register("jurusan")} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Judul Skema</label>
                <input {...register("judul")} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nomor Skema</label>
                <input {...register("nomor")} className="w-full border rounded px-3 py-2" />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-1">File Unit</label>
              <div className="flex w-full max-w-md">
                <label className="flex items-center px-4 py-2 bg-[#E77D35] text-white rounded-l cursor-pointer hover:opacity-90">
                  Pilih File
                  <input
                    type="file"
                    accept=".docx"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
                <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-r text-sm">
                  Convert file unit dari word
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {fields.map((unit, unitIndex) => (
                <div key={unit.id} className="border rounded-lg p-4 bg-gray-50 space-y-4">
                  <h3 className="text-lg font-semibold">Unit {unitIndex + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Kode Unit</label>
                      <input
                        {...register(`unit.${unitIndex}.kode`)}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Judul Unit</label>
                      <input
                        {...register(`unit.${unitIndex}.judul`)}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  {unit.elemen?.map((element, elemenIndex) => (
                    <div key={elemenIndex} className="border rounded p-3 bg-white space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Elemen {elemenIndex + 1}
                        </label>
                        <input
                          {...register(`unit.${unitIndex}.elemen.${elemenIndex}.text`)}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>

                      {element.item?.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          <label className="block text-sm font-medium mb-1">
                            {element.id}.{itemIndex + 1}
                          </label>
                          <input
                            {...register(
                              `unit.${unitIndex}.elemen.${elemenIndex}.item.${itemIndex}.text`
                            )}
                            defaultValue={item.text}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded text-white"
                style={{ backgroundColor: '#E77D35' }}
                onClick={() =>
                  append({
                    kode: "",
                    judul: "",
                    elemen: [{ id: "1", text: "", item: [{ id: "1.1", text: "" }] }],
                  })
                }
              >
                Tambah Unit
              </button>

              <button
                type="button"
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#E77D35',
                  border: '2px solid #E77D35',
                }}
              // onClick={() => remove(fields.length - 1)}
              >
                Hapus Unit
              </button>
            </div>


            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">File Unit</label>
                <div className="flex w-full max-w-md">
                  <label className="flex items-center px-4 py-2 bg-[#E77D35] text-white rounded-l cursor-pointer hover:opacity-90">
                    Pilih File
                    <input
                      type="file"
                      accept=".docx"
                      onChange={handleUploadEssay}
                      className="hidden"
                    />
                  </label>
                  <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-r text-sm">
                    Convert file unit dari word
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {essayText
                    .split('\n')
                    .filter(line => line.trim() !== '') // Hapus baris kosong
                    .map((line, index) => (
                      <div key={index} className="font-medium text-gray-800">
                        {index + 1}. {line.trim()}
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">File Unit</label>
                <div className="flex w-full max-w-md">
                  <label className="flex items-center px-4 py-2 bg-[#E77D35] text-white rounded-l cursor-pointer hover:opacity-90">
                    Pilih File
                    <input
                      type="file"
                      accept=".docx"
                      onChange={handleUploadPG}
                      className="hidden"
                    />
                  </label>
                  <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-r text-sm">
                    Convert file unit dari word
                  </div>
                </div>
                <div className="mt-2 space-y-2">
                  {pgText
                    .split(/\n|<br\s*\/?>/i)
                    .filter((line) => line.trim() !== "") // hilangkan baris kosong
                    .map((line, idx, arr) => {
                      if (idx % 5 === 0) {
                        // Baris soal
                        return (
                          <div key={idx} className="font-medium text-gray-800">
                            {`${Math.floor(idx / 5) + 1}. ${line.trim()}`}
                          </div>
                        );
                      } else {
                        // Baris opsi
                        // Ambil nomor soal
                        const questionNumber = Math.floor(idx / 5) + 1;
                        return (
                          <div key={idx} className="flex items-start gap-2 ml-4">
                            <input
                              type="radio"
                              name={`pg_${questionNumber}`}
                              className="mt-1"
                              value={line.trim()}
                            />
                            <span>{line.trim()}</span>
                          </div>
                        );
                      }
                    })}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="w-full text-white px-4 py-2 rounded"
                  style={{ backgroundColor: "#E77D35" }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#cf6e2f")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#E77D35")}
                >
                  Simpan Skema
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

async function extractDocxText(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value;
}

export function parseHTMLToSchema(html: string): SkemaType {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const rows = Array.from(doc.querySelectorAll("tr"));

  let unitList: Unit[] = [];
  let kodeUnit = "";
  let judulUnit = "";
  let elemenList: Element[] = [];
  let elementCounter = 1;

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const rowText = row.innerText.trim();

    if (/^Unit Kompetensi/i.test(rowText)) {
      if (kodeUnit && judulUnit && elemenList.length > 0) {
        unitList.push({
          kode: kodeUnit,
          judul: judulUnit,
          elemen: elemenList,
        });
      }
      kodeUnit = "";
      judulUnit = "";
      elemenList = [];
      elementCounter = 1;
    }

    if (rowText.includes("Kode Unit")) {
      const match = rowText.match(/Kode Unit\s*:\s*(.+)/);
      if (match) kodeUnit = match[1].trim();
    }

    if (rowText.includes("Judul Unit")) {
      const match = rowText.match(/Judul Unit\s*:\s*(.+)/);
      if (match) judulUnit = match[1].trim();
    }

    if (rowText.includes("Elemen")) {
      const elemenMatch = rowText.match(/Elemen\s*\d+\s*:\s*(.+)/);
      let fullText = elemenMatch ? elemenMatch[1].trim() : rowText;

      let elemenText = fullText;
      let criteriaText = "";
      if (fullText.includes("Kriteria Unjuk Kerja")) {
        [elemenText, criteriaText] = fullText.split("Kriteria Unjuk Kerja:");
        elemenText = elemenText.trim();
        criteriaText = criteriaText.trim();
      }

      const ol = row.querySelector("ol");
      const items = ol
        ? Array.from(ol.querySelectorAll("li")).map((li, i) => ({
          id: `${elementCounter}.${i + 1}`,
          text: li.textContent?.trim() || "",
        }))
        : [];

      elemenList.push({
        id: `${elementCounter++}`,
        text: elemenText,
        item: items,
      });
    }
  }

  if (kodeUnit && judulUnit && elemenList.length > 0) {
    unitList.push({
      kode: kodeUnit,
      judul: judulUnit,
      elemen: elemenList,
    });
  }

  const skema: SkemaType = {
    jurusan: "",
    judul: "",
    nomor: "",
    unit: unitList,
  };

  return skema;
}