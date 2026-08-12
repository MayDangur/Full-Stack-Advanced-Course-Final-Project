import {
  useRef,
  useState,
} from "react";

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

  // Upload the file selected from the hidden file input
  const handleUpload = async (
    file: File
  ) => {
    // Keep document uploads within the server limit
    if (file.size > 10 * 1024 * 1024) {
      alert(
        "The file must be smaller than 10 MB."
      );

      if (inputRef.current) {
        inputRef.current.value = "";
      }

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
      className="document-upload"
      style={{
        marginTop: "15px",
      }}
    >
      {/* Keep the native file input hidden and open it from the styled button */}
        <input
          ref={inputRef}
          type="file"
          className="hidden-file-input"
          hidden
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            // Upload immediately after the user chooses a file
            if (file) {
              handleUpload(file);
            }
          }}
/>

      <button
        type="button"
        className="btn-primary"
        onClick={() =>
          inputRef.current?.click()
        }
        disabled={uploading}
      >
        {uploading
        ? "Uploading..."
        : "↥ Upload Document"}
      </button>
    </div>
  );
}

export default UploadDocument;