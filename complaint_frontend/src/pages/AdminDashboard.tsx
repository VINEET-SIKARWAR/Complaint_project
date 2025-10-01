import React, { useEffect, useState } from "react";
import API from "../api/axios";
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
    assignedTo?: { name: string; email: string }; // show assigned staff if available
}

interface Staff {
    id: number;
    name: string;
    email: string;
}

const AdminDashboard: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<{ [key: number]: string }>({});
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // for modal
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pendingRequests, setPendingRequests] = useState<number>(0); 

    const name = localStorage.getItem("name") || "Admin";
    const email = localStorage.getItem("email") || "No email";
    const navigate = useNavigate()

    // Fetch complaints + staff
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [complaintsRes, staffRes,requestRes] = await Promise.all([
                    API.get("/complaints"), // Admin sees all complaints
                    API.get("/users/staff"), // Endpoint to get all staff members
                    API.get("/admin/staff-requests"),//Endpoint to get number of staff request
                ]);
                setComplaints(complaintsRes.data);
                setStaffList(staffRes.data);
                setPendingRequests(requestRes.data.length);
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const assignComplaint = async (complaintId: number, staffId: string) => {
        if (!staffId) return alert("Please select a staff member");

        try {
            await API.put(`/admin/assign/${complaintId}`, { staffId });
            alert("Complaint assigned successfully");

            // refresh complaints list
            const res = await API.get("/complaints");
            setComplaints(res.data);
        } catch (err) {
            console.error("Assign failed:", err);
            alert("Failed to assign complaint");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading complaints...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6">
            {/* Profile Card */}
            <div className="bg-white shadow rounded-lg p-6 mb-6 flex justify-between items-center">
                <div>
                <h2 className="text-xl font-bold text-gray-800">Welcome, {name}</h2>
                <p className="text-gray-600">{email}</p>
                <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-red-100 text-red-600">
                    ADMIN
                </span>
                </div>
                <button
                    onClick={() => navigate("/staff-requests")}
                    className="relative p-2 rounded-full hover:bg-gray-100"
                >
                    <BellIcon className="h-6 w-6 text-gray-700" />
                    {pendingRequests > 0 && (
                        <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                            {pendingRequests}
                        </span>
                    )}
                </button>

            </div>


            {/* Complaints Table */}
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
                            <th className="px-4 py-2">Assign</th>
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
                                    <span className="text-xs text-gray-500">{c.reporter?.email}</span>
                                </td>
                                <td className="px-4 py-2">
                                    {c.photoUrl ? (
                                        <img
                                            src={c.photoUrl}
                                            alt="complaint"
                                            className="h-12 w-12 object-cover rounded cursor-pointer hover:opacity-80"
                                            onClick={() => setSelectedImage(c.photoUrl || null)}
                                        />
                                    ) : (
                                        "No image"
                                    )}
                                </td>
                                <td className="px-4 py-2">
                                    {/* Assign Staff Dropdown */}
                                    {c.status === "OPEN" ? (
                                        <div className="flex items-center space-x-2">
                                            <select
                                                onChange={(e) =>
                                                    setSelectedStaff({ ...selectedStaff, [c.id]: e.target.value })
                                                }
                                                value={selectedStaff[c.id] || ""}
                                                className="border rounded px-2 py-1"
                                            >
                                                <option value="">Assign Staff</option>
                                                {staffList.map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        {s.name} ({s.email})
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => assignComplaint(c.id, selectedStaff[c.id])}
                                                className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="px-3 py-1 rounded bg-gray-200 text-gray-600 font-semibold">
                                            Assigned {c.assignedTo?.name && `to ${c.assignedTo.name}`}
                                        </span>
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

export default AdminDashboard;




