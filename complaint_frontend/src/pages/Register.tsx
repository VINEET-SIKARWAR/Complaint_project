import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
const Register: React.FC = () => {
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        password: string;
        role: "citizen" | "staff" | "admin" | "chief_admin";
        adminCode: string;
        chiefAdminCode: string;
        hostelId: number | "";
    }>({
        name: "",
        email: "",
        password: "",
        role: "citizen",
        adminCode: "",
        chiefAdminCode: "",
        hostelId: "",
    });

    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [hostels, setHostels] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(false);

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
        setErrors({ ...errors, [e.target.name]: "" });
    };

    //  Frontend validation before submitting
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Email validation (for citizen only)
        if (formData.role === "citizen") {
            const collegeEmailRegex = /^[\w.-]+@mnnit\.ac\.in$/;
            if (!collegeEmailRegex.test(formData.email)) {
                newErrors.email =
                    "Use your official MNNIT email (e.g., vineet.2025ca111@mnnit.ac.in)";
            }
        }

        // Strong password validation
        const strongPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!strongPassword.test(formData.password)) {
            newErrors.password =
                "Password must have 8+ chars, uppercase, lowercase, number, and special character.";
        }

        // Hostel required for staff/admin
        if (
            (formData.role === "staff" || formData.role === "admin") &&
            !formData.hostelId
        ) {
            newErrors.hostelId = "Hostel is required for this role.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; //return boolean
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!validateForm()) return; // stop if frontend validation fails
        try {
            setLoading(true);
            const payload = {
                ...formData,
                hostelId: formData.hostelId ? Number(formData.hostelId) : undefined,
                adminCode: formData.adminCode || undefined,
                chiefAdminCode: formData.chiefAdminCode || undefined,
            };
            console.log("Payload being sent to backend:", payload);

            const res = await API.post("/auth/register", payload);
            setMessage(res.data.message);
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "citizen",
                adminCode: "",
                chiefAdminCode: "",
                hostelId: "",
            });
            setErrors({});
        } catch (err: any) {
            // Handle backend Zod validation errors
            if (err.response?.data?.errors) {
                const backendErrors = err.response.data.errors;
                const newErrors: { [key: string]: string } = {};
                for (const key in backendErrors) {
                    newErrors[key] = backendErrors[key][0];
                }
                setErrors(newErrors);
            } else {
                setMessage(err.response?.data?.error || "Something went wrong");
                setErrors({ email: "Invalid credentials", password: "Invalid credentials" });
            }

        } finally {
            setLoading(false);
        };
    }




    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
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
                        className={`mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${errors.name ? "border-red-500" : "border-gray-300"
                            }`}
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
                        className={`mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${errors.email ? "border-red-500" : "border-gray-300"
                            }`}
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
                        className={`mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                        required
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs">{errors.password}</p>
                    )}
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
                                onChange={(e) =>
                                    setFormData({ ...formData, hostelId: Number(e.target.value) })
                                }
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
                            onChange={(e) =>
                                setFormData({ ...formData, hostelId: Number(e.target.value) })
                            }
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
                    disabled={loading}
                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                {message && (
                    <p
                        className={`mt-3 text-center text-sm ${message.toLowerCase().includes("invalid")
                                ? "text-red-600"
                                : "text-green-600"
                            }`}

                    >
                        {message}
                    </p>
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





