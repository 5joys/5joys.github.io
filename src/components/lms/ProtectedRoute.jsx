import { Navigate } from "react-router-dom";
import { useLms } from "../../context/LmsContext";

function ProtectedRoute({
  children,
  allowedRoles = null,
}) {
  const {
    currentUser,
    authLoading,
  } = useLms();

  if (authLoading) {
    return null;
  }

  if (!currentUser) {
    return (
      <Navigate
        to="/lms/login"
        replace
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(currentUser.role)
  ) {
    return (
      <Navigate
        to="/lms/dashboard"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;