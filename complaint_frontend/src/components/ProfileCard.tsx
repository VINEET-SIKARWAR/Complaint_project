// src/components/ProfileCard.tsx
import React from "react";

interface ProfileCardProps {
  name: string;
  email: string;
  role: "admin" | "staff" | "citizen"| "chief_admin";
  profileUrl?: string;
  children?: React.ReactNode; 
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  role,
  profileUrl,
  children,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {profileUrl && (
          <img
            src={profileUrl}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover"
          />
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-800">Welcome, {name}</h2>
          <p className="text-gray-600">{email}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
              role === "admin"
                ? "bg-red-100 text-red-600"
                : role === "staff"
                ? "bg-blue-100 text-blue-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {role.toUpperCase()}
          </span>
        </div>
      </div>

      
      <div>{children}</div>
    </div>
  );
};

export default ProfileCard;



