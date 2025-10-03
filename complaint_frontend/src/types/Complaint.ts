// src/types/Complaint.ts
export interface Complaint {
  id: number;
  title?: string;
  description?: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  category?: string;
  area?: string;
  photoUrl?: string;
  createdAt?: string;
  reporter?: { name: string; email: string };
  assignedTo?: { name: string; email: string }; // show assigned staff if available
  hostel?: {
    id: number;
    name: string;
  };
}
