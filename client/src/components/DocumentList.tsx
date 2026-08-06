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
  const [documents, setDocuments] = useState<
    Document[]
  >([]);

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

  if (!documents.length) {
    return (
      <p
        style={{
          marginTop: "15px",
          color: "#64748b",
        }}
      >
        No documents uploaded.
      </p>
    );
  }

  return (
    <div
      style={{
        marginTop: "15px",
      }}
    >
      {documents.map((doc) => (
        <div
          key={doc._id}
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "8px",
            border: "1px solid #e2e8f0",
            padding: "8px 12px",
            borderRadius: "8px",
          }}
        >
          <a
            href={`http://localhost:5000/${doc.filePath}`}
            target="_blank"
            rel="noreferrer"
          >
            📎 {doc.fileName}
          </a>

          <button
            className="btn-secondary"
            onClick={() =>
              deleteDocument(doc._id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default DocumentList;