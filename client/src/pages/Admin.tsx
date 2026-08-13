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

// Structure of a tax request displayed in the admin panel
interface TaxRequest {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  user: RequestUser;
  createdAt: string;
}

function Admin() {
  // Use the shared logout action from AuthContext
  const { logout } = useAuth();

  // Store all tax requests submitted by clients
  const [requests, setRequests] = useState<
    TaxRequest[]
  >([]);

  // Track the initial loading state
  const [loading, setLoading] =
    useState(true);

  // Store user-friendly API error messages
  const [error, setError] =
    useState("");

  // Track which request is currently being updated
  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  // Load tax requests from all clients
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/requests"
      );

      setRequests(response.data.data);
    } catch (error) {
      setError(
        "Unable to load client requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all client requests when the admin page opens
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

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

      // Replace only the request that was updated by the server
      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request._id === requestId
            ? response.data.data
            : request
        )
      );
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

        {/* Display API errors without hiding the existing requests */}
        {error && (
          <div
            className="admin-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Show an empty state when no client requests exist */}
        {requests.length === 0 ? (
          <div className="admin-empty">
            <h2>No client requests yet</h2>
            <p>
              New tax requests will appear here
              when clients submit them.
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

                {/* Display the date the request was submitted */}
                <p className="admin-date">
                  Submitted:{" "}
                  {new Date(
                    request.createdAt
                  ).toLocaleDateString()}
                </p>

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