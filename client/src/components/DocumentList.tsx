import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

// Structure of a document displayed in the list
interface Document {
  _id: string;
  fileName: string;
  filePath: string;
  mimeType?: string;
}

// Values received from the tax request card
interface DocumentListProps {
  taxRequestId: string;
  refresh: number;
}

function DocumentList({
  taxRequestId,
  refresh,
}: DocumentListProps) {
  // Store the documents that belong to the current tax request
  const [documents, setDocuments] =
    useState<Document[]>([]);

  // Store the ID of the document currently being downloaded
  const [downloadingId, setDownloadingId] =
    useState<string | null>(null);

  // Load all documents connected to the current tax request
  const loadDocuments = async () => {
    try {
      const { data } = await api.get(
        `/documents/${taxRequestId}`
      );

      // Save the documents returned by the server
      setDocuments(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete a selected document after user confirmation
  const deleteDocument = async (
    id: string
  ) => {
    if (
      !window.confirm(
        "Delete this document?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/documents/${id}`
      );

      // Reload the document list after a successful delete
      await loadDocuments();
    } catch (error) {
      console.error(error);
    }
  };

  // Download a document while preserving its original file name
  const downloadDocument = async (
    doc: Document
  ) => {
    try {
      setDownloadingId(doc._id);

      const response = await fetch(
        doc.filePath
      );

      if (!response.ok) {
        throw new Error(
          "Failed to download document"
        );
      }

      const blob = await response.blob();

      const blobUrl =
        window.URL.createObjectURL(blob);

      const link =
        window.document.createElement("a");

      link.href = blobUrl;
      link.download = doc.fileName;

      window.document.body.appendChild(
        link
      );

      link.click();
      link.remove();

      window.URL.revokeObjectURL(
        blobUrl
      );
    } catch (error) {
      console.error(error);

      window.alert(
        "Could not download the document."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // Reload documents after an upload or when the request changes
  useEffect(() => {
    loadDocuments();
  }, [refresh, taxRequestId]);

  // Show a friendly message when no documents were uploaded
  if (documents.length === 0) {
    return (
      <p
        style={{
          marginTop: "15px",
          color: "#64748b",
          fontStyle: "italic",
        }}
      >
        No documents uploaded yet.
      </p>
    );
  }

  return (
    <div
      style={{
        marginTop: "20px",
      }}
    >
      <h4
        style={{
          marginBottom: "10px",
        }}
      >
        Documents
      </h4>

      {/* Display every document connected to this tax request */}
      {documents.map((doc) => {
        // PDF and image files can be opened directly in a new browser tab
        const canView =
          doc.mimeType ===
            "application/pdf" ||
          doc.mimeType?.startsWith(
            "image/"
          );

        return (
          <div
            key={doc._id}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              border:
                "1px solid #e2e8f0",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            {/* Display the original uploaded file name */}
            <span
              style={{
                color: "#0f766e",
                fontWeight: "600",
                flex: 1,
              }}
            >
              📄 {doc.fileName}
            </span>

            {/* Show View only for supported preview file types */}
            {canView && (
              <a
                href={doc.filePath}
                target="_blank"
                rel="noreferrer"
                className="btn-text"
              >
                👁 View
              </a>
            )}

            {/* Download the document without leaving the page */}
            <button
              type="button"
              onClick={() =>
                downloadDocument(doc)
              }
              disabled={
                downloadingId === doc._id
              }
              className="btn-text"
              style={{
                border: "none",
                background: "transparent",
                cursor:
                  downloadingId ===
                  doc._id
                    ? "wait"
                    : "pointer",
                opacity:
                  downloadingId ===
                  doc._id
                    ? 0.6
                    : 1,
              }}
            >
              {downloadingId === doc._id
              ? "Downloading..."
              : "↓ Download"}
            </button>

            {/* Delete the selected document */}
            <button
              type="button"
              onClick={() =>
                deleteDocument(doc._id)
              }
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: "12px",
              }}
              aria-label={`Delete ${doc.fileName}`}
            >
              🗑
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default DocumentList;