import React, { useState } from "react";

import UploadDocument from "./UploadDocument";
import DocumentList from "./DocumentList";

// Structure of a tax request displayed in the card
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

// Prevent unnecessary re-renders when the props do not change
const TaxRequestCard = React.memo(
  function TaxRequestCard({
    request,
    onEdit,
    onDelete,
  }: TaxRequestCardProps) {
    // Used to refresh the document list after a new upload
    const [
      refreshDocuments,
      setRefreshDocuments,
    ] = useState(0);

    // Choose a color based on the request status
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

    // Convert the stored status into text for the user
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
      <div
        className="f-card tax-request-card"
        dir="ltr"
      >
        <h3>{request.title}</h3>

        {/* Display the current request status */}
        <div
          style={{
            display: "inline-block",
            backgroundColor:
              getStatusColor(
                request.status
              ),
            color: "white",
            padding: "6px 14px",
            borderRadius: "20px",
            fontWeight: "bold",
            fontSize: "14px",
            marginBottom: "15px",
          }}
        >
          {getStatusText(
            request.status
          )}
        </div>

        <p>{request.description}</p>

        {/* Upload documents for this specific tax request */}
        <UploadDocument
          taxRequestId={request._id}
          onUploadSuccess={() =>
            setRefreshDocuments(
              (prev) => prev + 1
            )
          }
        />

        {/* Refresh the document list after an upload */}
        <DocumentList
          taxRequestId={request._id}
          refresh={refreshDocuments}
        />

        <div
          className="request-card-actions"
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
            ✎ Edit
          </button>

          <button
            className="btn-secondary"
            onClick={onDelete}
          >
            🗑 Delete
          </button>
        </div>
      </div>
    );
  }
);

export default TaxRequestCard;