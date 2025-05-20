import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


export default function ProtectRouter({children}) {
    const user = useSelector(state => state.auth.user)

    return user.isLogged ? children : <Navigate to="/login" replace />;
}