import { ReactNode, createContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Profile, User, UserSignInInfo } from "@/types";
import { UseMutateFunction, useMutation } from 'react-query';
import { apiClient } from "@/api";
import { useContext } from "react";


const SIGN_IN_QUERY_KEY = ['sign-in'];
const SIGN_UP_QUERY_KEY = ['sign-up'];

type AuthResponseData = {
  accessToken: string,
  profile: Profile,
}

const signIn = async (user: UserSignInInfo): Promise<AuthResponseData> => {
  const { data } = await apiClient.post(`/api/v1/auth/login`, user);
  return data;
};

const signUp = async (credentials: User): Promise<{ message: string }> => {
  const { data } = await apiClient.post(`/api/v1/auth/signup`, credentials);
  return data;
};

export interface AuthContextValue {
  isLoading: boolean;
  accessToken: string | null;
  user: Profile | null;
  login: UseMutateFunction<AuthResponseData, Error, UserSignInInfo>; // Update type
  register: UseMutateFunction<{ message: string }, Error, User>; // Update type
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  isLoading: false,
  accessToken: null,
  user: null,
  login: () => { }, // Placeholder for login function
  register: () => { }, // Placeholder for login function
  logout: () => { }, // Placeholder for logout function
});


interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useLocalStorage<Profile | null>("user", null);
  const [accessToken, setAccessToken] = useLocalStorage<string | null>("accessToken", null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.pathname === "/login" || location.pathname === "/register") {
      navigate("/")
    }
  }, [user])

  const login = useMutation<AuthResponseData, Error, UserSignInInfo>(SIGN_IN_QUERY_KEY, signIn, {
    onSuccess: (data) => {
      setUser(data.profile)
      setAccessToken(data.accessToken)
      navigate("/");
    },
    onError: (error) => {
      console.error(error)
    },
  });

  const register = useMutation<{ message: string }, Error, User>(SIGN_UP_QUERY_KEY, signUp, {
    onSuccess: (data) => {
      console.log(data)
      // setUser(data.profile)
      // setAccessToken(data.accessToken)
      navigate("/");
    },
    onError: (error) => {
      console.error(error)
    },
  });

  const { mutate: loginFunction, isLoading: isLoginLoading } = login;
  const { mutate: regsiterFunction, isLoading: isRegisterLoading } = register;


  const logout = (): void => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  const isLoading = isLoginLoading || isRegisterLoading

  const value = useMemo(
    () => ({
      isLoading,
      accessToken,
      user,
      login: loginFunction,
      register: regsiterFunction,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = (): AuthContextValue => {
  return useContext(AuthContext);
};
