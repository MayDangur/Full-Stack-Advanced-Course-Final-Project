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

  // Store a separate client-side validation error for each field
  const [validationErrors, setValidationErrors] =
    useState({
      title: "",
      description: "",
    });

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

    // Clear previous validation errors when switching forms
    setValidationErrors({
      title: "",
      description: "",
    });
  }, [editingRequest]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // Collect all validation errors before sending data to the server
    const newErrors = {
      title: "",
      description: "",
    };

    // Make sure the request has a title
    if (!title.trim()) {
      newErrors.title =
        "Request title is required.";
    }

    // Make sure the request has a valid description
    if (!description.trim()) {
      newErrors.description =
        "Description is required.";
    } else if (description.trim().length < 5) {
      newErrors.description =
        "Description must be at least 5 characters.";
    }

    // Show all validation errors found in the current form
    setValidationErrors(newErrors);

    // Stop the request when at least one field is invalid
    if (
      Object.values(newErrors).some(
        (error) => error !== ""
      )
    ) {
      return;
    }

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

      // Clear validation errors after a successful save
      setValidationErrors({
        title: "",
        description: "",
      });

      // Let the parent refresh the request list
      onRequestCreated();
    } catch (error) {
      console.error(error);
      alert("Failed to save request");
    }
  };

  return (
    <div
      className="form-container tax-request-form"
      dir="ltr"
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

      <form
        onSubmit={handleSubmit}
        noValidate
      >
        <input
          type="text"
          placeholder="Request Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);

            // Clear only the title error while the user corrects it
            setValidationErrors({
              ...validationErrors,
              title: "",
            });
          }}
          required
        />

        {/* Show the validation error for the title field */}
        {validationErrors.title && (
          <p className="error-message">
            {validationErrors.title}
          </p>
        )}

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);

            // Clear only the description error while the user corrects it
            setValidationErrors({
              ...validationErrors,
              description: "",
            });
          }}
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

        {/* Show the validation error for the description field */}
        {validationErrors.description && (
          <p className="error-message">
            {validationErrors.description}
          </p>
        )}

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