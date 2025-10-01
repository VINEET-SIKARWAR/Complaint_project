import React, { useEffect, useState } from "react";
import API from "../api/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const StaffRequests: React.FC = () => {
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/admin/staff-requests");
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const promoteUser = async (userId: number) => {
    try {
      await API.put(`/admin/promote/${userId}`);
      setRequests((prev) => prev.filter((u) => u.id !== userId));
      alert("User promoted to staff");
    } catch (err) {
      alert("Failed to promote user");
    }
  };
  const rejectRequest = async (userId: number) => {
    try {
      await API.put(`/admin/reject/${userId}`); // backend should reset staffRequest=false
      setRequests((prev) => prev.filter((u) => u.id !== userId));
      alert("Request rejected");
    } catch (err) {
      alert("Failed to reject request");
    }
  };

  if (loading) return <p className="p-6">Loading requests...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Staff Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((u) => (
            <li
              key={u.id}
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <button
                onClick={() => promoteUser(u.id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Approve
              </button>
                <button
                  onClick={() => rejectRequest(u.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Reject
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StaffRequests;
