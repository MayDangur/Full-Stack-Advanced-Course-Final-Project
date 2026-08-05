import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import TaxRequestForm from "../components/TaxRequestForm";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import api from "../services/api";

interface TaxRequest {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}

function PersonalArea() {
  const { user, logout } = useAuth();

  const [showForm, setShowForm] = useState(false);

  const [requests, setRequests] = useState<TaxRequest[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [editingRequest, setEditingRequest] =
    useState<TaxRequest | null>(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        "/tax-requests"
      );

      setRequests(data.data);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load tax requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this request?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      await api.delete(`/tax-requests/${id}`);

      loadRequests();
    } catch (err) {
      console.error(err);

      setError(
        "Failed to delete request."
      );
    }
  };

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "approved":
        return "#22c55e";

      case "rejected":
        return "#ef4444";

      default:
        return "#f59e0b";
    }
  };

  const getStatusText = (
    status: string
  ) => {
    switch (status) {
      case "approved":
        return "Approved";

      case "rejected":
        return "Rejected";

      default:
        return "Pending";
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          TaxWise Israel 📈
        </div>

        <div className="nav-controls">
          <Link
            to="/"
            className="btn-text"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="btn-filled"
            onClick={logout}
          >
            Logout
          </Link>
        </div>
      </nav>

      <section className="features-section">
        <h1 className="section-title">
          {user?.name}'s Personal Area
        </h1>

        <p className="form-subtitle">
          Welcome back. Here you can
          manage, edit and track all your
          tax refund requests.
        </p>

        {error && (
          <ErrorMessage message={error} />
        )}

        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <button
            className="btn-primary"
            onClick={() => {
              if (showForm) {
                setEditingRequest(null);
              }

              setShowForm(!showForm);
            }}
          >
            {showForm
              ? "Close Form"
              : "+ Create New Request"}
          </button>
        </div>

        {showForm && (
          <TaxRequestForm
            editingRequest={editingRequest}
            onRequestCreated={() => {
              loadRequests();
              setShowForm(false);
              setEditingRequest(null);
            }}
          />
        )}

        <div className="features-grid">
          {requests.length === 0 ? (
            <p>No tax requests yet.</p>
          ) : (
            requests.map((request) => (
              <div
                className="f-card"
                key={request._id}
              >
                <h3>{request.title}</h3>

                <div
                  style={{
                    display: "inline-block",
                    backgroundColor:
                      getStatusColor(
                        request.status
                      ),
                    color: "white",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginBottom: "15px",
                  }}
                >
                  {getStatusText(
                    request.status
                  )}
                </div>

                <p>{request.description}</p>

                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    gap: "10px",
                    justifyContent:
                      "center",
                  }}
                >
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setEditingRequest(
                        request
                      );
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() =>
                      deleteRequest(
                        request._id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default PersonalArea;