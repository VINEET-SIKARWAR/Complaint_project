import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Stats {
  total: number;
  resolved: number;
  pending: number;
  avgResolutionTime: number;
}

const PublicPortal: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/public/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-700 mb-2">
          MNNIT Complaint Management Portal
        </h1>
        <p className="text-gray-600">
          Transparency. Accountability. Action.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl mb-10">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-indigo-600">{stats?.total}</h2>
          <p className="text-gray-500 text-sm">Total Complaints</p>
        </div>
        <div className="bg-green-50 shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-green-600">{stats?.resolved}</h2>
          <p className="text-gray-500 text-sm">Resolved</p>
        </div>
        <div className="bg-yellow-50 shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-yellow-600">{stats?.pending}</h2>
          <p className="text-gray-500 text-sm">Pending</p>
        </div>
        <div className="bg-blue-50 shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-blue-600">
            {stats?.avgResolutionTime.toFixed(1)} hrs
          </h2>
          <p className="text-gray-500 text-sm">Avg Resolution Time</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-2 bg-gray-100 text-indigo-700 rounded-lg shadow hover:bg-gray-200"
        >
          Register
        </button>
      </div>

      <footer className="mt-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} MNNIT Complaint Portal
      </footer>
    </div>
  );
};

export default PublicPortal;
