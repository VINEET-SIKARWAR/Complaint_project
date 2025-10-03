import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "citizen",
        adminCode: "",
        chiefAdminCode: "",
        hostelId: "",
    });

    const [message, setMessage] = useState("");
    const [hostels, setHostels] = useState<{ id: number; name: string }[]>([]);
    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const res = await API.get("/hostel"); // backend route we created
                setHostels(res.data);
            } catch (err) {
                console.error("Failed to fetch hostels", err);
            }
        };
        fetchHostels();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                hostelId: formData.hostelId ? Number(formData.hostelId) : undefined,
            };
            const res = await API.post("/auth/register", formData);
            setMessage(res.data.message);
        } catch (err: any) {
            setMessage(err.response?.data?.error || "Something went wrong");
        }
    };




    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg space-y-6"
            >
                <h2 className="text-2xl font-bold text-gray-900">Register</h2>
                <p className="text-sm text-gray-500">
                    Create an account to submit and track complaints.
                </p>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Role
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="citizen">Citizen</option>
                        <option value="staff">Request Staff</option>
                        <option value="admin">Admin</option>
                        <option value="chief_admin">Chief Admin</option>
                    </select>
                </div>

                {/* Admin Code + Hostel */}
                {formData.role === "admin" && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Admin Code
                            </label>
                            <input
                                type="text"
                                name="adminCode"
                                placeholder="Enter admin code"
                                value={formData.adminCode}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <select
                                name="hostelId"
                                value={formData.hostelId}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">-- Select Hostel --</option>
                                {hostels.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {/* Staff Hostel */}
                {formData.role === "staff" && (
                    <div>
                        <select
                            name="hostelId"
                            value={formData.hostelId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        >
                            <option value="">-- Select Hostel --</option>
                            {hostels.map((h) => (
                                <option key={h.id} value={h.id}>
                                    {h.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Chief Admin Code */}
                {formData.role === "chief_admin" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Chief Admin Code
                        </label>
                        <input
                            type="text"
                            name="chiefAdminCode"
                            placeholder="Enter chief admin code"
                            value={formData.chiefAdminCode}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Register
                </button>

                {message && (
                    <p className="mt-3 text-center text-sm text-gray-600">{message}</p>
                )}
                <p className="mt-4 text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;





