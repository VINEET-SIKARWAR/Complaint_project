import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";


interface Hostel {
  id: number;
  name: string;
}
const NewComplaint: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [hostelId, setHostelId] = useState<number | "">("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const navigate = useNavigate();

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];


  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await API.get("/hostel");
        setHostels(res.data);
      } catch (err: any) {
        console.error("Failed to load hostels:", err);
      }
    };
    fetchHostels();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && !allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, and PNG files are allowed.");
      e.target.value = ""; // reset file input
      setPhoto(null);
      return;
    }

    setError("");
    setPhoto(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("area", area);
      formData.append("hostelId", hostelId.toString())
      if (photo) formData.append("photo", photo);

      await API.post("/complaints/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to register complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg">
      {loading && <Loader />}
      <h2 className="text-xl font-bold mb-4">Register a Complaint</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Area e.g(Mess,Sanitation,....)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={hostelId}
          onChange={(e) => setHostelId(Number(e.target.value))}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Hostel</option>
          {hostels.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>

        {/* File upload with validation */}
        <div>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Allowed formats: JPG, JPEG, PNG
          </p>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default NewComplaint;
