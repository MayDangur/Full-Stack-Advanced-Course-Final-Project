import { useState } from "react";

function TaxRequestForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    alert(
      "The request will be connected to the server in the next step."
    );
  };

  return (
    <div
      className="form-container"
      style={{
        marginBottom: "40px",
      }}
    >
      <h2>Create Tax Request</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Request Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
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
          Save Request
        </button>
      </form>
    </div>
  );
}

export default TaxRequestForm;