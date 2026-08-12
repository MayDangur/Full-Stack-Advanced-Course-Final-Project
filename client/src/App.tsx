import {
  lazy,
  Suspense,
} from "react";
import {
  Routes,
  Route,
} from "react-router-dom";

import LoadingSpinner from "./components/LoadingSpinner";
import PrivateRoute from "./components/PrivateRoute";

// Lazy load pages only when they are needed
const Home = lazy(
  () => import("./pages/Home")
);

const Login = lazy(
  () => import("./pages/Login")
);

const Register = lazy(
  () => import("./pages/Register")
);

const PersonalArea = lazy(
  () => import("./pages/PersonalArea")
);

const NotFound = lazy(
  () => import("./pages/NotFound")
);

function App() {
  // Show a loading spinner while a page is being loaded
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {/* Main application routes */}
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Personal area for logged-in users only */}
        <Route
          path="/personal-area"
          element={
            <PrivateRoute>
              <PersonalArea />
            </PrivateRoute>
          }
        />

        {/* Catch any route that does not exist */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;