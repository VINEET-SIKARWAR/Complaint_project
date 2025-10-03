// src/pages/ChiefAdminDashboard.tsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import ProfileCard from "../components/ProfileCard";
import { Complaint } from "../types/Complaint";

interface Hostel {
    id: number;
    name: string;
}

const ChiefAdminDashboard: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [selectedHostel, setSelectedHostel] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const name = localStorage.getItem("name") || "Chief Admin";
    const email = localStorage.getItem("email") || "No email";
    const role =
        (localStorage.getItem("role") as "citizen" | "staff" | "admin" | "chief_admin") || "citizen";


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [complaintsRes, hostelsRes] = await Promise.all([
                    API.get("/complaints"),   // chief_admin sees ALL
                    API.get("/hostel"),      // for filter dropdown
                ]);
                setComplaints(complaintsRes.data);
                setHostels(hostelsRes.data);
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

  const filteredComplaints = selectedHostel
  ? complaints.filter(c => String(c.hostel?.id) === selectedHostel)
  : complaints;



    const downloadCSV = async () => {
        try {
            const res = await API.get("/reports/csv", {
                responseType: "blob", // important for files
            });

            // Create a link to download file
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "complaints_report.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err: any) {
            console.error("Error downloading CSV", err);
            alert(err.response?.data?.error || "Failed to download CSV");
        }
    };


    if (loading) return <p className="text-center mt-10">Loading complaints...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6 space-y-6">
            {/* Profile */}
            <ProfileCard name={name} email={email} role={role} />

            {/* Filters */}
            <div className="flex space-x-4 mb-4">
                <select
                    value={selectedHostel}
                    onChange={(e) => setSelectedHostel(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">All Hostels</option>
                    {hostels.map((h) => (
                        <option key={h.id} value={h.id}>
                            {h.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={downloadCSV}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Download CSV
                </button>
            </div>

            {/* Complaints Table */}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Hostel</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Reporter</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.map((c) => (
                            <tr key={c.id} className="border-t">
                                <td className="px-4 py-2">{c.title}</td>
                                <td className="px-4 py-2">{(c as any).hostel?.name || "-"}</td>
                                <td className="px-4 py-2">{c.category}</td>
                                <td className="px-4 py-2">{c.status}</td>
                                <td className="px-4 py-2">{c.reporter?.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChiefAdminDashboard;
