import { useContext } from "react";
import { Store } from "../utils/Store";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTING_MANAGER } from "../navigation/Router";

export default function ProtectedRoute() {
  const {
    state: { userInfo },
  } = useContext(Store)
  if (userInfo) {
    return <Outlet />
  } else {
    return <Navigate to={ROUTING_MANAGER.SIGN_IN} />
  }
}