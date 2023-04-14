import { Navigate } from "react-router-dom";

const getUser = () => localStorage.getItem("user");

const ProtectedRoute = ({ children }) => {
    const user = getUser();
    if (!user) {
        return <Navigate to="/login" state={{ warning: true }} />;
    }

    return children;
};

export default ProtectedRoute;
