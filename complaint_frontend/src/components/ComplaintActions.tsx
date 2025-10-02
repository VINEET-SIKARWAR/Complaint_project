import React from "react";
import { Complaint } from "../types/Complaint";

interface ComplaintActionsProps {
  role: "citizen" | "staff" | "admin";
  complaint: Complaint;
  onUpdateStatus: (id: number, status: Complaint["status"]) => void;
  onDelete?: (id: number) => void;
}

const ComplaintActions: React.FC<ComplaintActionsProps> = ({
  role,
  complaint,
  onUpdateStatus,
  onDelete,
}) => {
  if (role === "staff" || role === "admin") {
    return (
      <div className="space-x-2">
        {complaint.status === "OPEN" && (
          <button
            onClick={() => onUpdateStatus(complaint.id, "IN_PROGRESS")}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start
          </button>
        )}
        {complaint.status === "IN_PROGRESS" && (
          <button
            onClick={() => onUpdateStatus(complaint.id, "RESOLVED")}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Resolve
          </button>
        )}
        {complaint.status === "RESOLVED" && (
          <span className="text-green-600 font-semibold">Resolved</span>
        )}
      </div>
    );
  }

  if (role === "citizen") {
    return (
      <button
        onClick={() => onDelete?.(complaint.id)}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
    );
  }

  return <span>-</span>;
};

export default ComplaintActions;

