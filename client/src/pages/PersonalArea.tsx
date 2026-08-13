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
  createdAt: string;
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
  const [, setProfileImageFile] =
    useState<File | null>(null);

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

  // Controls the profile image removal confirmation
  const [
    showRemoveImageConfirmation,
    setShowRemoveImageConfirmation,
  ] = useState(false);

  // Stores the request waiting for delete confirmation
  const [
    requestToDelete,
    setRequestToDelete,
  ] = useState<string | null>(null);

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
    try {
      setError("");

      const { data } = await api.delete(
        "/auth/profile-image"
      );

      // Update AuthContext so the image disappears immediately
      updateUser(data.user);

      setProfileImageFile(null);
      setShowRemoveImageConfirmation(false);
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
    try {
      await api.delete(
        `/tax-requests/${id}`
      );

      setRequestToDelete(null);

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
        <div>
          <Link
            to="/"
            className="logo"
          >
            TaxWise Israel 📈
          </Link>

          {user && (
            <div
              dir="ltr"
              style={{
                marginTop: "5px",
                fontSize: "14px",
                color: "#64748b",
                fontWeight: "600",
                textAlign: "left",
              }}
            >
              <span>👤</span>{" "}
              <span>User: {user.name}</span>
            </div>
          )}
        </div>

        <div
          className="nav-controls"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <Link
            to="/"
            className="btn-text"
            style={{
              marginLeft: "0",
            }}
          >
            Home
          </Link>

          <Link
            to="/about"
            className="btn-text"
          >
            About
          </Link>

          <Link
            to="/faq"
            className="btn-text"
          >
            FAQ
          </Link>

          {/* Show admin navigation only to admin users */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="btn-text"
            >
              Admin Panel
            </Link>
          )}

          <Link
            to="/login"
            className="btn-filled"
            onClick={logout}
          >
            ↪ Logout
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
              gap: "8px",
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
                minWidth: "145px",
                padding: "7px 13px",
                background: "white",
                color: "#1e293b",
                border: "1px solid #cbd5e1",
                borderRadius: "7px",
                fontSize: "12px",
                fontFamily: "inherit",
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
                onClick={() =>
                  setShowRemoveImageConfirmation(
                    true
                  )
                }
                className="profile-remove-button"
                style={{
                  minWidth: "145px",
                  padding: "7px 13px",
                  background: "white",
                  color: "#1e293b",
                  border: "1px solid #ef4444",
                  borderRadius: "7px",
                  fontWeight: "600",
                  fontFamily: "inherit",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                🗑 Remove Profile Image
              </button>
            )}

            {showRemoveImageConfirmation && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "16px",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  background: "#fff7f7",
                  maxWidth: "360px",
                  width: "100%",
                }}
              >
                <p
                  style={{
                    margin: "0 0 14px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Are you sure you want to
                  remove your profile image?
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setShowRemoveImageConfirmation(
                        false
                      )
                    }
                    style={{
                      padding: "7px 14px",
                      background: "white",
                      color: "#1e293b",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      removeProfileImage
                    }
                    style={{
                      padding: "7px 14px",
                      background: "#ef4444",
                      color: "white",
                      border: "1px solid #ef4444",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              </div>
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
            marginTop: "28px",
            marginBottom: "40px",
          }}
        >
          <button
            className="btn-primary"
            style={{
              minWidth: "180px",
              padding: "11px 22px",
              background: "#00bfa5",
              color: "white",
              border: "1px solid #00bfa5",
              borderRadius: "8px",
              fontWeight: "600",
              fontFamily: "inherit",
            }}
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
                  setRequestToDelete(
                    request._id
                  )
                }
              />
            ))
          )}
        </div>

        {requestToDelete && (
          <div
            className="confirmation-modal-overlay"
            onClick={() =>
              setRequestToDelete(null)
            }
          >
            <div
              className="confirmation-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-request-title"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <p
                id="delete-request-title"
                className="confirmation-modal-title"
              >
                Are you sure you want to
                delete this request?
              </p>

              <p className="confirmation-modal-message">
                Deleting this request will
                also permanently delete all
                attached documents.
              </p>

              <div className="confirmation-modal-actions">
                <button
                  type="button"
                  onClick={() =>
                    setRequestToDelete(null)
                  }
                  className="confirmation-modal-cancel"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteRequest(
                      requestToDelete
                    )
                  }
                  className="confirmation-modal-delete"
                >
                  Delete Request
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default PersonalArea;