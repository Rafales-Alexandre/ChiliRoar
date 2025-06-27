import React from 'react';

export default function Header() {
  return (
    <header className="w-full rounded-xl p-0 mb-6 flex flex-col relative overflow-hidden bg-transparent">
      <img
        src="/chiliRoarBanner.png"
        alt="ChiliRoar Banner"
        className="w-full h-auto object-cover rounded-xl"
        style={{ maxHeight: 180 }}
      />
    </header>
  );
} 