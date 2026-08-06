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
  AppDispatch,
} from "../store/store";

import {
  setRequests,
} from "../store/taxRequestSlice";

interface TaxRequest {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}

function PersonalArea() {
  const { user, logout } = useAuth();

  const dispatch =
    useDispatch<AppDispatch>();

  const requests = useSelector(
    (state: RootState) =>
      state.taxRequests.requests
  );

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [editingRequest, setEditingRequest] =
    useState<TaxRequest | null>(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        "/tax-requests"
      );

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

      loadRequests();
    } catch (err) {
      console.error(err);

      setError(
        "Failed to delete request."
      );
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
          manage, edit and track all
          your tax refund requests.
        </p>

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
            editingRequest={
              editingRequest
            }
            onRequestCreated={() => {
              loadRequests();
              setShowForm(false);
              setEditingRequest(null);
            }}
          />
        )}

        <div className="features-grid">
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