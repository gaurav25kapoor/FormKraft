import Link from "next/link";
import React from "react";

type Props = {
  userId?: string;
};

const UpgradeButton: React.FC<Props> = () => {
  return (
    <Link
      href="/dashboard/upgrade"
      className="inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
    >
      Upgrade Now
    </Link>
  );
};

export default UpgradeButton;
