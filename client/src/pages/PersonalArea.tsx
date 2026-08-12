import { useEffect, useRef, useState } from "react";
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
  const {
    user,
    logout,
    updateUser,
  } = useAuth();

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

  // Stores the selected profile image before uploading
  const [
    profileImageFile,
    setProfileImageFile,
  ] = useState<File | null>(null);

  // Used while a profile image is being uploaded
  const [
    uploadingProfileImage,
    setUploadingProfileImage,
  ] = useState(false);

  // Reference to the hidden profile image file input
  const profileImageInputRef =
    useRef<HTMLInputElement>(null);

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

  // Upload or replace the current user's profile image
  const uploadProfileImage = async (
    file: File
  ) => {
    try {
      setUploadingProfileImage(true);
      setError("");

      const formData = new FormData();

      formData.append(
        "profileImage",
        file
      );

      const { data } = await api.put(
        "/auth/profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update AuthContext so the new image appears immediately
      updateUser(data.user);

      setProfileImageFile(null);

      // Clear the hidden file input after a successful upload
      if (profileImageInputRef.current) {
        profileImageInputRef.current.value =
          "";
      }
    } catch (err) {
      console.error(err);

      setError(
        "Failed to update profile image."
      );
    } finally {
      setUploadingProfileImage(false);
    }
  };

  // Remove the current user's profile image
  const removeProfileImage = async () => {
    const confirmRemove =
      window.confirm(
        "Are you sure you want to remove your profile image?"
      );

    if (!confirmRemove) return;

    try {
      setError("");

      const { data } = await api.delete(
        "/auth/profile-image"
      );

      // Update AuthContext so the image disappears immediately
      updateUser(data.user);

      setProfileImageFile(null);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to remove profile image."
      );
    }
  };

  // Delete a request after user confirmation
  const deleteRequest = async (
    id: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this request?\n\nDeleting this request will also permanently delete all attached documents."
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

      <section
        className="features-section personal-area"
        dir="ltr"
      >
        <h1 className="section-title">
          {user?.name}'s Personal Area
        </h1>

        <p className="form-subtitle">
          Welcome back. Here you can
          manage, edit and track all
          your tax refund requests.
        </p>

        {/* Show and update the current user's profile image */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={`${user.name}'s profile`}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "15px",
                border: "3px solid #e2e8f0",
              }}
            />
          ) : (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                margin: "0 auto 15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e2e8f0",
                fontSize: "42px",
              }}
            >
              👤
            </div>
          )}

          <div
            className="profile-image-actions"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {/* Keep the native file input hidden and open it from the styled button */}
            <input
              ref={profileImageInputRef}
              type="file"
              accept="image/*"
              className="hidden-file-input"
              hidden
              onChange={(e) => {
                const file =
                  e.target.files?.[0] ??
                  null;

                setProfileImageFile(file);

                // Upload immediately after the user chooses an image
                if (file) {
                  uploadProfileImage(
                    file
                  );
                }
              }}
            />

            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                profileImageInputRef.current?.click()
              }
              disabled={
                uploadingProfileImage
              }
              style={{
                minWidth: "220px",
              }}
            >
              {uploadingProfileImage
                ? "Uploading..."
                : user?.profileImage
                  ? "☁ Update Profile Image"
                  : "☁ Upload Profile Image"}
            </button>

            {user?.profileImage && (
              <button
                type="button"
                onClick={removeProfileImage}
                className="profile-remove-button"
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "14px 35px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  minWidth: "220px",
                }}
              >
                🗑 Remove Profile Image
              </button>
            )}
          </div>
        </div>

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
              ? "✕ Close Form"
              : "＋ Create New Request"}
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

        <div className="features-grid personal-requests-grid">
          {/* Show an empty state when the user has no requests */}
          {requests.length === 0 ? (
            <p className="personal-empty-state">
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