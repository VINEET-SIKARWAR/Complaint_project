// src/components/ProfileCard.tsx
import React from "react";

interface ProfileCardProps {
  name: string;
  email: string;
  role: "admin" | "staff" | "citizen";
}

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-600",
  staff: "bg-blue-100 text-blue-600",
  citizen: "bg-green-100 text-green-600",
};

const ProfileCard: React.FC<ProfileCardProps> = ({ name, email, role }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Welcome, {name}</h2>
        <p className="text-gray-600">{email}</p>
        <span
          className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${roleColors[role]}`}
        >
          {role.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default ProfileCard;
