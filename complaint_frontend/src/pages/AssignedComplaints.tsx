// src/pages/AssignedComplaints.tsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import ImageModal from "../components/ImageModal";

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  category: string;
  area: string;
  photoUrl?: string;
  createdAt: string;
  reporter: { name: string; email: string };
}

const AssignedComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // fetch assigned complaints
  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await API.get("/complaints/assigned");
        setComplaints(res.data);

        // store initial count (only IN_PROGRESS)
        const count = res.data.filter(
          (c: Complaint) => c.status === "IN_PROGRESS"
        ).length;
        localStorage.setItem("assignedCount", count.toString());
        window.dispatchEvent(new Event("storage"));
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };
    fetchAssigned();
  }, []);

  // update status handler
  const updateStatus = async (id: number, status: "RESOLVED") => {
    try {
      await API.put(`/complaints/${id}/status`, { status });

      // update complaint status locally
      const updatedComplaints = complaints.map((c) =>
        c.id === id ? { ...c, status } : c
      );
      setComplaints(updatedComplaints);

      // recalc count for bell (only unresolved complaints)
      const newCount = updatedComplaints.filter(
        (c) => c.status === "IN_PROGRESS"
      ).length;
      localStorage.setItem("assignedCount", newCount.toString());
      window.dispatchEvent(new Event("storage"));
    } catch {
      alert("Failed to update complaint status");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading assigned complaints...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Assigned Complaints</h2>

      {complaints.length === 0 ? (
        <p>No assigned complaints</p>
      ) : (
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Area</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Reporter</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Action</th>
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
                    className={`px-2 py-1 rounded text-xs ${
                      c.status === "IN_PROGRESS"
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
                <td className="px-4 py-2">
                  {c.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => updateStatus(c.id, "RESOLVED")}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Resolve
                    </button>
                  )}
                  {c.status === "RESOLVED" && (
                    <span className="text-green-600 font-semibold">Resolved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default AssignedComplaints;



