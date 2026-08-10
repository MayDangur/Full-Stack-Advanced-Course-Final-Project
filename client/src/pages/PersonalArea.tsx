import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useAuth } from "../context/AuthContext";
import TaxRequestForm from "../components/TaxRequestForm";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import TaxRequestCard from "../components/TaxRequestCard";

import api from "../services/api";

import type {
  RootState,
} from "../store/store";

import {
  setRequests,
} from "../store/taxRequestSlice";

// Structure of a tax request used on this page
interface TaxRequest {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}

function PersonalArea() {
  // Get the logged-in user and logout action from AuthContext
  const { user, logout } = useAuth();

  const dispatch =
    useDispatch();

  // Read the current requests from Redux
  const requests = useSelector(
    (state: RootState) =>
      state.taxRequests.requests
  );

  // Controls whether the create/edit form is visible
  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // Stores the request currently being edited
  const [editingRequest, setEditingRequest] =
    useState<TaxRequest | null>(null);

  // Load the user's tax requests from the server
  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        "/tax-requests"
      );

      // Keep the latest request list in Redux
      dispatch(
        setRequests(data.data)
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load tax requests."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete a request after user confirmation
  const deleteRequest = async (
    id: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this request?"
      );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/tax-requests/${id}`
      );

      // Refresh the list after a successful delete
      loadRequests();
    } catch (err) {
      console.error(err);

      setError(
        "Failed to delete request."
      );
    }
  };

  // Load requests when the personal area first opens
  useEffect(() => {
    loadRequests();
  }, []);

  // Show a loading state while requests are being fetched
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
          manage, edit and track all
          your tax refund requests.
        </p>

        {/* Show API errors when an operation fails */}
        {error && (
          <ErrorMessage
            message={error}
          />
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
              // Clear edit mode when closing the form
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

        {/* The same form is used for creating and editing requests */}
        {showForm && (
          <TaxRequestForm
            editingRequest={
              editingRequest
            }
            onRequestCreated={() => {
              // Refresh the list and close the form after saving
              loadRequests();
              setShowForm(false);
              setEditingRequest(null);
            }}
          />
        )}

        <div className="features-grid">
          {/* Show an empty state when the user has no requests */}
          {requests.length === 0 ? (
            <p>
              No tax requests yet.
            </p>
          ) : (
            requests.map((request) => (
              <TaxRequestCard
                key={request._id}
                request={request}
                onEdit={() => {
                  // Open the form with the selected request
                  setEditingRequest(
                    request
                  );
                  setShowForm(true);
                }}
                onDelete={() =>
                  deleteRequest(
                    request._id
                  )
                }
              />
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default PersonalArea;