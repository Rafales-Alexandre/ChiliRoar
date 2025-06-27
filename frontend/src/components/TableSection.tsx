import React from 'react';

interface TableRow {
  name: string;
  value: string;
  delta: string;
  color: string;
}

interface TableSectionProps {
  title: string;
  data: TableRow[];
  positive?: boolean;
}

export default function TableSection({ title, data, positive = true }: TableSectionProps) {
  return (
    <div className="mb-6 bg-gray-900 rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="flex gap-4 mb-2 text-xs">
        <span className="text-green-400">Δ Absolute (bps)</span>
        <span className="text-gray-400">Δ Relative (%)</span>
      </div>
      <table className="w-full text-sm bg-gray-800 rounded-lg">
        <thead>
          <tr className="text-gray-400">
            <th className="py-2 px-3 text-left">Name</th>
            <th className="py-2 px-3 text-left">Current</th>
            <th className="py-2 px-3 text-left">Δ1D</th>
            <th className="py-2 px-3 text-left">Δ7D</th>
            <th className="py-2 px-3 text-left">Δ30D</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-gray-700">
              <td className="py-2 px-3 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full inline-block ${row.color}`}></span>
                {row.name}
              </td>
              <td className="py-2 px-3">{row.value}</td>
              <td className={`py-2 px-3 font-bold ${positive ? 'text-green-400' : 'text-red-400'}`}>{row.delta}</td>
              <td className="py-2 px-3 text-gray-400">--</td>
              <td className="py-2 px-3 text-gray-400">--</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 