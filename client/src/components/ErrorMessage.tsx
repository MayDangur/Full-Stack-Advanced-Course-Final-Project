interface ErrorMessageProps {
  message: string;
}

// Display a reusable error message to the user
function ErrorMessage({
  message,
}: ErrorMessageProps) {
  return (
    <div
      style={{
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "16px",
        borderRadius: "8px",
        margin: "30px auto",
        width: "fit-content",
        fontWeight: "bold",
      }}
    >
      {/* Display the provided error message */}
      ⚠ {message}
    </div>
  );
}

export default ErrorMessage;