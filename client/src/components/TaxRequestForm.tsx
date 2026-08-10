import { useEffect, useState } from "react";
import api from "../services/api";

interface TaxRequestFormProps {
  onRequestCreated: () => void;

  editingRequest?: {
    _id: string;
    title: string;
    description: string;
  } | null;
}

function TaxRequestForm({
  onRequestCreated,
  editingRequest,
}: TaxRequestFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  // Fill the form when an existing request is selected for editing
  useEffect(() => {
    if (editingRequest) {
      setTitle(editingRequest.title);
      setDescription(
        editingRequest.description
      );
    } else {
      // Start with an empty form when creating a new request
      setTitle("");
      setDescription("");
    }
  }, [editingRequest]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      // Update the existing request when editing
      if (editingRequest) {
        await api.put(
          `/tax-requests/${editingRequest._id}`,
          {
            title,
            description,
          }
        );
      } else {
        // Create a new request when the form is not in edit mode
        await api.post("/tax-requests", {
          title,
          description,
        });
      }

      // Clear the form after a successful save
      setTitle("");
      setDescription("");

      // Let the parent refresh the request list
      onRequestCreated();
    } catch (error) {
      console.error(error);
      alert("Failed to save request");
    }
  };

  return (
    <div
      className="form-container"
      style={{
        marginBottom: "40px",
      }}
    >
      {/* Change the title depending on create or edit mode */}
      <h2>
        {editingRequest
          ? "Edit Tax Request"
          : "Create Tax Request"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Request Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          required
          style={{
            width: "100%",
            minHeight: "140px",
            padding: "14px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />

        <button
          type="submit"
          className="btn-primary"
          style={{
            marginTop: "20px",
          }}
        >
          {/* Use the matching action label for each mode */}
          {editingRequest
            ? "Update Request"
            : "Save Request"}
        </button>
      </form>
    </div>
  );
}

export default TaxRequestForm;