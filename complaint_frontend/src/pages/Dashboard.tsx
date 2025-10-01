import React, { useEffect, useState } from "react";
import API from "../api/axios";

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  area: string;
  createdAt: string;
  reporter: { name: string; email: string };
}

const Dashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User info from localStorage (set after login)
 const className=localStorage.getItem("name") ;
  const email = localStorage.getItem("email") ;
  const role = localStorage.getItem("role");
  

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

  const updateStatus = async (id: number, status: string) => {
    try {
      await API.put(`/complaints/${id}`, { status });
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading complaints...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">

      {/* Profile Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800">Welcome, {className}</h2>
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
          {role?.toUpperCase()}
        </span>
      </div>

      {/* Complaints Table */}
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
              {role !== "citizen" && <th className="px-4 py-2">Actions</th>}
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
                    className={`px-2 py-1 rounded text-xs ${
                      c.status === "OPEN"
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
                  <span className="text-xs text-gray-500">{c.reporter?.email}</span>
                </td>
                {role !== "citizen" && (
                  <td className="px-4 py-2">
                    {role === "staff" || role === "admin" ? (
                      <div className="space-x-2">
                        {c.status === "OPEN" && (
                          <button
                            onClick={() => updateStatus(c.id, "IN_PROGRESS")}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Start
                          </button>
                        )}
                        {c.status === "IN_PROGRESS" && (
                          <button
                            onClick={() => updateStatus(c.id, "RESOLVED")}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

