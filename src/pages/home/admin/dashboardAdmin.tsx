"use client"; // jika pakai App Router

import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Progress } from "@/components/ui/progress";

Chart.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  // Data Donut Chart
  const donutData = {
    assessor: 160,
    skema: 30,
    tuk: 12,
  };

  const chartData = {
    labels: ["Assessor", "Skema Sertifikasi", "TUK"],
    datasets: [
      {
        data: [donutData.assessor, donutData.skema, donutData.tuk],
        backgroundColor: ["#D2691E", "#FFE4B5", "#8FBC8F"],
        borderWidth: 0,
      },
    ],
  };

  const progressData = [
    { label: "Data Asesi Melengkapi Berkas", value: 85 },
    { label: "Data Asesi Diproses", value: 60 },
    { label: "Data Asesi Dinyatakan Kompeten", value: 90 },
    { label: "Data Asesi Dinyatakan Belum Kompeten", value: 30 },
  ];

  return (
    <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Donut Chart */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4">
          Komposisi Elemen Sertifikasi
        </h2>
        <div className="w-64 h-64 mx-auto">
          <Doughnut
            data={chartData}
            options={{
              plugins: {
                legend: {
                  position: "right",
                  labels: {
                    boxWidth: 12,
                  },
                },
              },
              cutout: "80%",
            }}
          />
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4">
          Kemajuan Proses Administratif
        </h2>
        <div className="space-y-4">
          {progressData.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1" >
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <Progress value={item.value} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}