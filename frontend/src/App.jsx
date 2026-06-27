import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import { ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { SendMoney } from "./pages/SendMoney";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";

function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/signin"} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route
        path="/signup"
        element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>}
      />
      <Route
        path="/signin"
        element={<PublicOnlyRoute><Signin /></PublicOnlyRoute>}
      />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      <Route
        path="/send"
        element={<ProtectedRoute><SendMoney /></ProtectedRoute>}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
