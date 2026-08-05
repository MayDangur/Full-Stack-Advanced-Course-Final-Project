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

  useEffect(() => {
    if (editingRequest) {
      setTitle(editingRequest.title);
      setDescription(
        editingRequest.description
      );
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingRequest]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      if (editingRequest) {
        await api.put(
          `/tax-requests/${editingRequest._id}`,
          {
            title,
            description,
          }
        );
      } else {
        await api.post("/tax-requests", {
          title,
          description,
        });
      }

      setTitle("");
      setDescription("");

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
          {editingRequest
            ? "Update Request"
            : "Save Request"}
        </button>
      </form>
    </div>
  );
}

export default TaxRequestForm;