import { useEffect, useState } from "react";
import api from "../services/api";

interface Document {
  _id: string;
  fileName: string;
  filePath: string;
}

interface DocumentListProps {
  taxRequestId: string;
  refresh: number;
}

function DocumentList({
  taxRequestId,
  refresh,
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);

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
    )
      return;

    try {
      await api.delete(`/documents/${id}`);

      loadDocuments();
    } catch (error) {
      console.error(error);
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

      {documents.map((doc) => (
        <div
          key={doc._id}
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            padding: "10px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <a
            href={`http://localhost:5000/uploads/${doc.filePath}`}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: "none",
              color: "#0f766e",
              fontWeight: "600",
              flex: 1,
            }}
          >
            📄 {doc.fileName}
          </a>

          <button
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
      ))}
    </div>
  );
}

export default DocumentList;