import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";


import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { store } from "./store/store";


import "./styles/style.css";


// Render the React application
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Provide Google authentication to the app */}
    <GoogleOAuthProvider
      clientId="626658383553-pq0m9u0tl27vhseurt1dgs0ds4ifeo6j.apps.googleusercontent.com"
    >
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