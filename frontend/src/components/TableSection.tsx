import React from 'react';

interface TableRow {
  name: string;
  value: string;
  delta: string;
  color: string;
  variation?: number; // Variation en pourcentage
}

interface TableSectionProps {
  title: string;
  data: TableRow[];
  positive?: boolean;
}

export default function TableSection({ title, data, positive = true }: TableSectionProps) {
  // Fonction pour déterminer la couleur basée sur la variation
  const getVariationColor = (row: TableRow) => {
    if (row.variation === undefined) {
      return row.color; // Utiliser la couleur par défaut si pas de variation
    }

    if (row.variation > 0) {
      return 'bg-green-500'; // Vert pour positif
    } else if (row.variation < 0) {
      return 'bg-red-500'; // Rouge pour négatif
    } else {
      return 'bg-gray-500'; // Gris pour neutre
    }
  };

  // Fonction pour déterminer la couleur du texte de variation
  const getVariationTextColor = (row: TableRow) => {
    if (row.variation === undefined) {
      return positive ? 'text-green-400' : 'text-red-400';
    }

    if (row.variation > 0) {
      return 'text-green-400';
    } else if (row.variation < 0) {
      return 'text-red-400';
    } else {
      return 'text-gray-400';
    }
  };

  // Fonction pour déterminer la couleur de fond de la ligne
  const getRowBackgroundColor = (row: TableRow) => {
    if (row.variation === undefined) {
      return 'hover:bg-gray-700';
    }

    if (row.variation > 0) {
      return 'hover:bg-green-500/10 bg-green-500/5';
    } else if (row.variation < 0) {
      return 'hover:bg-red-500/10 bg-red-500/5';
    } else {
      return 'hover:bg-gray-700 bg-gray-700/50';
    }
  };

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
            <tr key={i} className={`border-t border-gray-700 transition-colors ${getRowBackgroundColor(row)}`}>
              <td className="py-2 px-3 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full inline-block ${getVariationColor(row)}`}></span>
                {row.name}
              </td>
              <td className="py-2 px-3">{row.value}</td>
              <td className={`py-2 px-3 font-bold ${getVariationTextColor(row)}`}>{row.delta}</td>
              <td className="py-2 px-3 text-gray-400">--</td>
              <td className="py-2 px-3 text-gray-400">--</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 