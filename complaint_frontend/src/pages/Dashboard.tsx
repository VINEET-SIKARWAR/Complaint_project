// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import ComplaintActions from "../components/ComplaintActions";
import { Complaint } from "../types/Complaint";
import ProfileCard from "../components/ProfileCard";

const Dashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User info from localStorage
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role =
    (localStorage.getItem("role") as "citizen" | "staff" | "admin") || "citizen";

  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await API.get("/complaints");
        setComplaints(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const updateStatus = async (id: number, status: Complaint["status"]) => {
    try {
      await API.put(`/complaints/${id}/status`, { status });
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  const deleteComplaint = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      await API.delete(`/complaints/${id}`);
      setComplaints((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete complaint");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading complaints...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <div>
      <ProfileCard
        name={name || "Citizen"}
        email={email || "No email"}
        role={role}
      />
    </div>

      {/* Citizen-only: Register a complaint */ }
  {
    role === "citizen" && (
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/new-complaint")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Register a Complaint
        </button>
      </div>
    )
  }

  {/* Complaints Table */ }
  <div className="bg-white shadow rounded-lg overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-600">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Category</th>
          <th className="px-4 py-2">Area</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Reporter</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {complaints.map((c) => (
          <tr key={c.id} className="border-t">
            <td className="px-4 py-2">{c.title}</td>
            <td className="px-4 py-2">{c.description}</td>
            <td className="px-4 py-2">{c.category}</td>
            <td className="px-4 py-2">{c.area}</td>
            <td className="px-4 py-2">
              <span
                className={`px-2 py-1 rounded text-xs ${c.status === "OPEN"
                    ? "bg-yellow-100 text-yellow-800"
                    : c.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
              >
                {c.status}
              </span>
            </td>
            <td className="px-4 py-2">
              {c.reporter?.name} <br />
              <span className="text-xs text-gray-500">
                {c.reporter?.email}
              </span>
            </td>

            {/* Actions column */}
            <td className="px-4 py-2">
              <ComplaintActions
                role={role}
                complaint={c}
                onUpdateStatus={updateStatus}
                onDelete={deleteComplaint}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
    </div >
  );
};

export default Dashboard;



