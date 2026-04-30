import { Navigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";

const Index = () => {
  const { currentUser } = useApp();
  return <Navigate to={currentUser ? "/dashboard" : "/login"} replace />;
};

export default Index;
