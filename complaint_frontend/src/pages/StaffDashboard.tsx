// src/pages/StaffDashboard.tsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import ProfileCard from "../components/ProfileCard";
import ImageModal from "../components/ImageModal";
import { BellIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  area: string;
  photoUrl?: string;
  createdAt: string;
  reporter: { name: string; email: string };
}

const StaffDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [assignedCount, setAssignedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "Staff";
  const email = localStorage.getItem("email") || "No email";
  const role = (localStorage.getItem("role") as "staff" | "admin" | "citizen") || "staff";
  const profileUrl = localStorage.getItem("profileUrl") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, assignedRes] = await Promise.all([
          API.get("/complaints"), // all complaints
          API.get("/complaints/assigned"), // only assigned to staff
        ]);
        setComplaints(allRes.data);
        setAssignedCount(assignedRes.data.filter((c: Complaint) => c.status === "IN_PROGRESS").length);


        // store assigned complaints count in localStorage for sync
        localStorage.setItem("assignedCount", assignedRes.data.length.toString());
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // listen for changes from AssignedComplaints
    const handleStorage = () => {
      const updatedCount = parseInt(localStorage.getItem("assignedCount") || "0");
      setAssignedCount(updatedCount);
    };
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (loading) return <p className="text-center mt-10">Loading complaints...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* Profile + Bell */}
      <div className="bg-white shadow rounded-lg p-6 mb-6 flex justify-between items-center">
        <ProfileCard name={name} email={email} role={role} profileUrl={profileUrl} />
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/assigned-complaints")}
        >
          <BellIcon className="h-7 w-7 text-gray-700" />
          {assignedCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2">
              {assignedCount}
            </span>
          )}
        </div>
      </div>

      {/* All Complaints Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">All Complaints</h3>
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Area</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Reporter</th>
              <th className="px-4 py-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">{c.title}</td>
                <td className="px-4 py-2">{c.category}</td>
                <td className="px-4 py-2">{c.area}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${c.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : c.status === "RESOLVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {c.reporter?.name} <br />
                  <span className="text-xs text-gray-500">{c.reporter?.email}</span>
                </td>
                <td className="px-4 py-2">
                  {c.photoUrl ? (
                    <img
                      src={c.photoUrl}
                      alt="complaint"
                      className="h-12 w-12 object-cover rounded cursor-pointer hover:opacity-80"
                      onClick={() => setSelectedImage(c.photoUrl ?? null)}
                    />
                  ) : (
                    "No image"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default StaffDashboard;






