import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

interface Document {
  _id: string;
  fileName: string;
  filePath: string;
  mimeType?: string;
}

interface DocumentListProps {
  taxRequestId: string;
  refresh: number;
}

function DocumentList({
  taxRequestId,
  refresh,
}: DocumentListProps) {
  const [documents, setDocuments] =
    useState<Document[]>([]);

  const [downloadingId, setDownloadingId] =
    useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      const { data } = await api.get(
        `/documents/${taxRequestId}`
      );

      setDocuments(data.data);
    } catch (error) {
      console.error(error);
    }
  };

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

      await loadDocuments();
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    loadDocuments();
  }, [refresh, taxRequestId]);

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

      {documents.map((doc) => {
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
            <span
              style={{
                color: "#0f766e",
                fontWeight: "600",
                flex: 1,
              }}
            >
              📄 {doc.fileName}
            </span>

            {canView && (
              <a
                href={doc.filePath}
                target="_blank"
                rel="noreferrer"
                className="btn-text"
              >
                View
              </a>
            )}

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
                : "Download"}
            </button>

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