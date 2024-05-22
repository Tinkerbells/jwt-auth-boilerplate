import { Navigate } from "react-router-dom";
import { FC, ReactNode } from "react";
import { useAuth } from "@/context";

interface ProtectedProps {
  children: ReactNode
}

export const Protected: FC<ProtectedProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};
