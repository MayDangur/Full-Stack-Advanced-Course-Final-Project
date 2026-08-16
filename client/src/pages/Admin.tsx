import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

// Basic user information returned with each tax request
interface RequestUser {
  _id: string;
  name: string;
  email: string;
}

// Structure of a document connected to a tax request
interface RequestDocument {
  _id: string;
  fileName: string;
  filePath: string;
  mimeType?: string;
}

// Structure of a tax request displayed in the admin panel
interface TaxRequest {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  user: RequestUser;
  createdAt: string;
}

type StatusFilter =
  | "all"
  | "pending"
  | "approved"
  | "rejected";

function Admin() {
  // Use the shared authentication state and logout action from AuthContext
  const { user, logout } = useAuth();

  // Store all tax requests submitted by clients
  const [requests, setRequests] = useState<
    TaxRequest[]
  >([]);

  // Store the selected request status filter
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  // Store documents for each tax request
  const [documentsByRequest, setDocumentsByRequest] =
    useState<Record<string, RequestDocument[]>>({});

  // Track the initial loading state
  const [loading, setLoading] =
    useState(true);

  // Store user-friendly API error messages
  const [error, setError] =
    useState("");

  // Track which request is currently being updated
  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  // Track which document is currently being downloaded
  const [downloadingId, setDownloadingId] =
    useState<string | null>(null);

  // Load the documents connected to a specific client request
  const fetchRequestDocuments = useCallback(
    async (requestId: string) => {
      try {
        const response = await api.get(
          `/admin/requests/${requestId}/documents`
        );

        setDocumentsByRequest(
          (currentDocuments) => ({
            ...currentDocuments,
            [requestId]: response.data.data,
          })
        );
      } catch (error) {
        setDocumentsByRequest(
          (currentDocuments) => ({
            ...currentDocuments,
            [requestId]: [],
          })
        );
      }
    },
    []
  );

  // Load tax requests from all clients with an optional status filter
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const endpoint =
        statusFilter === "all"
          ? "/admin/requests"
          : `/admin/requests?status=${statusFilter}`;

      const response = await api.get(endpoint);

      // Show the oldest submitted request first
      const sortedRequests = [
        ...response.data.data,
      ].sort(
        (
          firstRequest: TaxRequest,
          secondRequest: TaxRequest
        ) =>
          new Date(
            firstRequest.createdAt
          ).getTime() -
          new Date(
            secondRequest.createdAt
          ).getTime()
      );

      setRequests(sortedRequests);

      // Load the documents connected to every client request
      await Promise.all(
        sortedRequests.map(
          (request: TaxRequest) =>
            fetchRequestDocuments(
              request._id
            )
        )
      );
    } catch (error) {
      setError(
        "Unable to load client requests."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchRequestDocuments, statusFilter]);

  // Load client requests when the page opens or the status filter changes
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Download a client document while preserving its original file name
  const downloadDocument = async (
    document: RequestDocument
  ) => {
    try {
      setDownloadingId(document._id);

      const response = await fetch(
        document.filePath
      );

      if (!response.ok) {
        throw new Error(
          "Failed to download document"
        );
      }

      const blob = await response.blob();

      const blobUrl =
        window.URL.createObjectURL(blob);

      const link =
        window.document.createElement("a");

      link.href = blobUrl;
      link.download = document.fileName;

      window.document.body.appendChild(
        link
      );

      link.click();
      link.remove();

      window.URL.revokeObjectURL(
        blobUrl
      );
    } catch (error) {
      console.error(error);

      window.alert(
        "Could not download the document."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // Update the status of a client request
  const handleStatusChange = async (
    requestId: string,
    status:
      | "pending"
      | "approved"
      | "rejected"
  ) => {
    try {
      setUpdatingId(requestId);
      setError("");

      const response = await api.patch(
        `/admin/requests/${requestId}/status`,
        {
          status,
        }
      );

      // Remove the updated request if it no longer matches the active filter
      if (
        statusFilter !== "all" &&
        status !== statusFilter
      ) {
        setRequests((currentRequests) =>
          currentRequests.filter(
            (request) =>
              request._id !== requestId
          )
        );
      } else {
        // Replace only the request that was updated by the server
        setRequests((currentRequests) =>
          currentRequests.map((request) =>
            request._id === requestId
              ? response.data.data
              : request
          )
        );
      }
    } catch (error) {
      setError(
        "Unable to update request status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Show a loading indicator while requests are being fetched
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

        <div className="nav-controls">
          <Link
            to="/"
            className="btn-text"
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

          <Link
            to="/personal-area"
            className="btn-text"
          >
            Personal Area
          </Link>

          <Link
            to="/login"
            className="btn-filled"
            onClick={logout}
          >
            ↪ Logout
          </Link>
        </div>
      </nav>

      <main className="admin-page">
        {/* Admin page introduction */}
        <section className="admin-header">
          <p className="admin-eyebrow">
            TaxWise Israel
          </p>

          <h1>Admin Requests Management</h1>

          <p>
            Review and manage tax requests
            submitted by all clients.
          </p>
        </section>

        {/* Filter client requests by their current status */}
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <label
            htmlFor="request-status-filter"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            Filter by status
          </label>

          <select
            id="request-status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as StatusFilter
              )
            }
          >
            <option value="all">
              All Requests
            </option>
            <option value="pending">
              Pending
            </option>
            <option value="approved">
              Approved
            </option>
            <option value="rejected">
              Rejected
            </option>
          </select>
        </div>

        {/* Display API errors without hiding the existing requests */}
        {error && (
          <div
            className="admin-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Show an empty state when no matching client requests exist */}
        {requests.length === 0 ? (
          <div className="admin-empty">
            <h2>No client requests found</h2>
            <p>
              No client requests match the
              selected status.
            </p>
          </div>
        ) : (
          <section className="admin-requests">
            {/* Display every client request in a separate card */}
            {requests.map((request) => (
              <article
                className="admin-request-card"
                key={request._id}
              >
                <div className="admin-request-top">
                  <div>
                    <h2>{request.title}</h2>

                    {/* Display the client connected to this request */}
                    <p className="admin-client">
                      {request.user?.name ||
                        "Unknown client"}
                      {request.user?.email
                        ? ` — ${request.user.email}`
                        : ""}
                    </p>
                  </div>

                  {/* Show the current request status */}
                  <span
                    className={`admin-status admin-status-${request.status}`}
                  >
                    {request.status}
                  </span>
                </div>

                <p className="admin-description">
                  {request.description}
                </p>

                {/* Display the date and time the request was submitted */}
                <p className="admin-date">
                  🕒 Submitted:{" "}
                  {new Date(
                    request.createdAt
                  ).toLocaleDateString()}{" "}
                  at{" "}
                  {new Date(
                    request.createdAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {/* Display documents uploaded by the client */}
                <div
                  style={{
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: "10px",
                      fontSize: "16px",
                    }}
                  >
                    Documents
                  </h3>

                  {documentsByRequest[
                    request._id
                  ]?.length ? (
                    documentsByRequest[
                      request._id
                    ].map((document) => {
                      const canView =
                        document.mimeType ===
                          "application/pdf" ||
                        document.mimeType?.startsWith(
                          "image/"
                        );

                      return (
                        <div
                          key={document._id}
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px",
                            marginBottom: "8px",
                            border:
                              "1px solid #e2e8f0",
                            borderRadius: "8px",
                          }}
                        >
                          <span
                            style={{
                              color: "#0f766e",
                              fontWeight: "600",
                              flex: 1,
                            }}
                          >
                            📄{" "}
                            {document.fileName}
                          </span>

                          {canView && (
                            <a
                              href={
                                document.filePath
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="btn-text"
                            >
                              👁 View
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              downloadDocument(
                                document
                              )
                            }
                            disabled={
                              downloadingId ===
                              document._id
                            }
                            className="btn-text"
                            style={{
                              border: "none",
                              background:
                                "transparent",
                              cursor:
                                downloadingId ===
                                document._id
                                  ? "wait"
                                  : "pointer",
                              opacity:
                                downloadingId ===
                                document._id
                                  ? 0.6
                                  : 1,
                            }}
                          >
                            {downloadingId ===
                            document._id
                              ? "Downloading..."
                              : "↓ Download"}
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p
                      style={{
                        color: "#64748b",
                        fontStyle: "italic",
                        fontSize: "14px",
                      }}
                    >
                      No documents uploaded.
                    </p>
                  )}
                </div>

                {/* Allow the admin to change only the request status */}
                <div className="admin-actions">
                  <label
                    htmlFor={`status-${request._id}`}
                  >
                    Request status
                  </label>

                  <select
                    id={`status-${request._id}`}
                    value={request.status}
                    disabled={
                      updatingId === request._id
                    }
                    onChange={(event) =>
                      handleStatusChange(
                        request._id,
                        event.target.value as
                          | "pending"
                          | "approved"
                          | "rejected"
                      )
                    }
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="approved">
                      Approved
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>
                  </select>

                  {/* Give feedback while the selected request is updating */}
                  {updatingId === request._id && (
                    <span className="admin-updating">
                      Updating...
                    </span>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default Admin;