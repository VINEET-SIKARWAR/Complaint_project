import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const NewComplaint: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

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

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("area", area);
      if (photo) formData.append("photo", photo);

      await API.post("/complaints/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/dashboard"); 
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to register complaint");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg">
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
          placeholder="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

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
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewComplaint;
