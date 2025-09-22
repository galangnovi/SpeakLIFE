"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Row = {
  city: string | null;
  created_at: string;
};

type ChartData = {
  city: string;
  count: number;
};

// helper untuk rapihin nama kota
function normalizeCity(name: string | null): string {
  if (!name) return "Unknown";
  const clean = name.trim().toLowerCase();
  return clean
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function CityComparisonPerYear() {
  const [dataPerYear, setDataPerYear] = useState<Record<number, ChartData[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);

      const { data: rows, error } = await supabase
        .from("user_emergency")
        .select("city, created_at");

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const grouped: Record<number, Record<string, number>> = {};

      rows?.forEach((row: Row) => {
        const year = new Date(row.created_at).getFullYear();
        const city = normalizeCity(row.city);

        if (!grouped[year]) {
          grouped[year] = {};
        }
        if (!grouped[year][city]) {
          grouped[year][city] = 0;
        }
        grouped[year][city] += 1;
      });

      const perYear: Record<number, ChartData[]> = {};
      Object.entries(grouped).forEach(([year, cityCounts]) => {
        perYear[parseInt(year, 10)] = Object.entries(cityCounts).map(
          ([city, count]) => ({
            city,
            count,
          })
        );
      });

      setDataPerYear(perYear);
      setLoading(false);
    };

    fetchChartData();
  }, []);

  // Pie chart colors
  const COLORS = ["#4F46E5", "#F59E0B"];

  // helper buat total count per tahun
  function getYearTotal(year: number) {
    return dataPerYear[year]?.reduce((acc, cur) => acc + cur.count, 0) || 0;
  }

  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-16 max-w-7xl mx-auto mt-6 sm:mt-8 lg:mt-10 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <p className="text-center text-gray-500 animate-pulse text-sm sm:text-base">
          Loading data...
        </p>
      ) : (
        Object.entries(dataPerYear)
          .sort(([a], [b]) => parseInt(b) - parseInt(a))
          .map(([yearStr, chartData]) => {
          const year = parseInt(yearStr, 10);
          const prevYear = year - 1;

          // buat data pie -> total tahun sekarang vs sebelumnya
          const pieData = [
            { name: `Tahun ${year}`, value: getYearTotal(year) },
            { name: `Tahun ${prevYear}`, value: getYearTotal(prevYear) },
          ];

          return (
            <div
              key={year}
              className="p-4 sm:p-6 lg:p-8 shadow-xl flex flex-col lg:flex-row gap-6 lg:gap-8 rounded-2xl bg-gradient-to-br from-white via-indigo-50 to-gray-50 backdrop-blur-md w-full border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center">
                  <span className="mr-2 text-lg sm:text-xl">📊</span>
                  Jumlah Tren Pesan Darurat - Tahun {year}
                </h2>
                <ResponsiveContainer width="100%" height={300} className="sm:h-[350px] lg:h-[400px]">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id={`gradient${year}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.9} />
                        <stop
                          offset="95%"
                          stopColor="#4F46E5"
                          stopOpacity={0.3}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="city"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#6B7280",
                        fontSize: 10,
                        fontWeight: 500,
                      }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#6B7280",
                        fontSize: 10,
                        fontWeight: 500,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#F9FAFB",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                      labelStyle={{ color: "#374151", fontWeight: 600 }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
                    <Bar
                      dataKey="count"
                      name="Jumlah User"
                      fill={`url(#gradient${year})`}
                      radius={[4, 4, 0, 0]}
                      animationBegin={300}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 mt-6 lg:mt-0">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-4 text-gray-700">
                  📈 Perbandingan Total Pesan Darurat Tahun {year} vs {prevYear}
                </h3>
                <ResponsiveContainer width="100%" height={250} className="sm:h-[280px] lg:h-[300px]">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name.split(' ')[1]} ${(percent ?? 0).toFixed(1)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#F9FAFB",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })
      )}
      {/* Footer with branding and recommendations */}
      <div className="p-3 sm:p-4 border-t border-gray-300 text-center text-xs sm:text-sm text-[#3A2F2F]">
        <div className="flex items-center justify-center mb-2 gap-6">
          <span className="font-semibold">Developed by 🔸SpeakLIFE</span>
        </div>
      </div>
    </div>
  );
}
