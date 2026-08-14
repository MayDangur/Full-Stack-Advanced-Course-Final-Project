import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { store } from "./store/store";

import "./styles/style.css";

// Google OAuth client ID from environment variables
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Render the React application
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Provide Google authentication to the app */}
    <GoogleOAuthProvider clientId={googleClientId}>
      {/* Connect the application to the Redux store */}
      <Provider store={store}>
        {/* Enable client-side routing */}
        <BrowserRouter>
          {/* Make authentication state available across the app */}
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);