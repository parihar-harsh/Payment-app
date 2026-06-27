import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

PublicOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
