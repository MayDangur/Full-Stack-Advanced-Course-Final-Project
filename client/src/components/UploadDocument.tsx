import { useRef, useState } from "react";
import api from "../services/api";

interface UploadDocumentProps {
  taxRequestId: string;
  onUploadSuccess: () => void;
}

function UploadDocument({
  taxRequestId,
  onUploadSuccess,
}: UploadDocumentProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const handleUpload = async () => {
    const file =
      inputRef.current?.files?.[0];

    console.log(file);

    if (!file) {
      alert("Please choose a file.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append(
        "document",
        file
      );

      formData.append(
        "taxRequestId",
        taxRequestId
      );

      await api.post(
        "/documents/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      onUploadSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "15px",
      }}
    >
      <input
        ref={inputRef}
        type="file"
      />

      <button
        type="button"
        className="btn-primary"
        style={{
          marginTop: "10px",
        }}
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading
          ? "Uploading..."
          : "Upload Document"}
      </button>
    </div>
  );
}

export default UploadDocument;