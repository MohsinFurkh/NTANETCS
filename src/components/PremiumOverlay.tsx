'use client';

import { useRouter } from 'next/navigation';

export default function PremiumOverlay() {
  const router = useRouter();

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/pricing');
  };

  return (
    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p className="font-medium mb-2">Premium Feature</p>
        <button
          onClick={handleUpgradeClick}
          className="btn btn-primary text-sm"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
} 