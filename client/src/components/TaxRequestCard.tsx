import { useState } from "react";

import UploadDocument from "./UploadDocument";
import DocumentList from "./DocumentList";

interface TaxRequest {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}

interface TaxRequestCardProps {
  request: TaxRequest;
  onEdit: () => void;
  onDelete: () => void;
}

function TaxRequestCard({
  request,
  onEdit,
  onDelete,
}: TaxRequestCardProps) {
  const [refreshDocuments, setRefreshDocuments] =
    useState(0);

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "approved":
        return "#22c55e";

      case "rejected":
        return "#ef4444";

      default:
        return "#f59e0b";
    }
  };

  const getStatusText = (
    status: string
  ) => {
    switch (status) {
      case "approved":
        return "Approved";

      case "rejected":
        return "Rejected";

      default:
        return "Pending";
    }
  };

  return (
    <div className="f-card">
      <h3>{request.title}</h3>

      <div
        style={{
          display: "inline-block",
          backgroundColor:
            getStatusColor(request.status),
          color: "white",
          padding: "6px 14px",
          borderRadius: "20px",
          fontWeight: "bold",
          fontSize: "14px",
          marginBottom: "15px",
        }}
      >
        {getStatusText(request.status)}
      </div>

      <p>{request.description}</p>

      <UploadDocument
        taxRequestId={request._id}
        onUploadSuccess={() =>
          setRefreshDocuments(
            (prev) => prev + 1
          )
        }
      />

      <DocumentList
        taxRequestId={request._id}
        refresh={refreshDocuments}
      />

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <button
          className="btn-primary"
          onClick={onEdit}
        >
          Edit
        </button>

        <button
          className="btn-secondary"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaxRequestCard;