import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-blue-400 to-blue-700 rounded-xl p-8 mb-6 flex flex-col relative overflow-hidden">
      <h1 className="text-4xl font-bold text-black">Pre-TGE Arena</h1>
      <div className="absolute top-0 right-0 w-1/3 h-24 bg-blue-300 opacity-30 rounded-bl-3xl" />
    </header>
  );
} 