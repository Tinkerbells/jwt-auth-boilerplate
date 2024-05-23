import { ReactNode, createContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Profile, User, UserSignInInfo } from "@/types";
import { UseMutateFunction, useMutation } from 'react-query';
import { apiClient } from "@/api";
import { useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";


const SIGN_IN_QUERY_KEY = ['sign-in'];
const SIGN_UP_QUERY_KEY = ['sign-up'];
const LOGOUT_QUERY_KEY = ['logout'];
const VERIFY_QUERY_KEY = ['verify'];

type AuthResponseData = {
  accessToken: string,
  profile: Profile,
}

const fetchVerify = async (otp: string): Promise<void> => {
  const { data } = await apiClient.post(`/api/v1/verify-email`, { otp });
  return data;
};

const fetchLogout = async (): Promise<void> => {
  const { data } = await apiClient.post(`/api/v1/auth/logout`);
  return data;
};

const signIn = async (user: UserSignInInfo): Promise<AuthResponseData> => {
  const { data } = await apiClient.post<AuthResponseData>(`/api/v1/auth/login`, user);
  return data;
};

const signUp = async (credentials: User): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>(`/api/v1/auth/signup`, credentials);
  return data;
};

export interface AuthContextValue {
  /* eslint-disable */
  loginError: AxiosError<unknown, any> | null;
  logoutError: AxiosError<unknown, any> | null;
  registerError: AxiosError<unknown, any> | null;
  verifyError: AxiosError<unknown, any> | null;
  isError: boolean;
  isLoading: boolean;
  accessToken: string | null;
  user: Profile | null;
  login: UseMutateFunction<AuthResponseData, AxiosError, UserSignInInfo>;
  register: UseMutateFunction<{ message: string }, AxiosError, User>;
  logout: UseMutateFunction<void, AxiosError, void>
  verify: UseMutateFunction<void, AxiosError, string>
}

export const AuthContext = createContext<AuthContextValue>({
  isError: false,
  loginError: null,
  logoutError: null,
  registerError: null,
  verifyError: null,
  isLoading: false,
  accessToken: null,
  user: null,
  login: () => { }, // Placeholder for login function
  register: () => { }, // Placeholder for register function
  logout: () => { }, // Placeholder for logout function
  verify: () => { }, // Placeholder for verify function
});


interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { toast } = useToast()
  const [user, setUser] = useLocalStorage<Profile | null>("user", null);
  const [accessToken, setAccessToken] = useLocalStorage<string | null>("accessToken", null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.pathname === "/login" || location.pathname === "/register") {
      navigate("/")
    }
  }, [user])

  const login = useMutation<AuthResponseData, AxiosError, UserSignInInfo>(SIGN_IN_QUERY_KEY, signIn, {
    onSuccess: (data) => {
      setUser(data.profile)
      setAccessToken(data.accessToken)
      navigate("/");
    },
    onError: (error) => {
      console.error(error)
    },
  });

  const register = useMutation<{ message: string }, AxiosError, User>(LOGOUT_QUERY_KEY, signUp, {
    onSuccess: () => {
      navigate("/verify-email");
    },
    onError: (error) => {
      console.error(error)
      if (error.response?.status !== 409)
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
    },
  });

  const logout = useMutation<void, AxiosError, void>(SIGN_UP_QUERY_KEY, fetchLogout, {
    onSuccess: () => {
      setUser(null);
      setAccessToken(null);
      navigate("/signin", { replace: true });
    },
    onError: (error) => {
      console.error(error)
    },
  });

  const verify = useMutation<void, AxiosError, string>(VERIFY_QUERY_KEY, fetchVerify, {
    onSuccess: () => {
      navigate("/signin", { replace: true });
    },
    onError: (error) => {
      console.error(error)
    },
  });

  const { mutate: loginFunction, isLoading: isLoginLoading, isError: isLoginError, error: loginError } = login;
  const { mutate: logoutFunction, isLoading: isLogoutLoading, isError: isLogoutError, error: logoutError } = logout;
  const { mutate: regsiterFunction, isLoading: isRegisterLoading, isError: isRegisterError, error: registerError } = register;
  const { mutate: verifyFunction, isLoading: isVerifyLoading, isError: isVerifyError, error: verifyError } = verify;


  const isLoading = isLoginLoading || isLogoutLoading || isRegisterLoading || isVerifyLoading

  const isError = isLoginError || isLogoutError || isRegisterError || isVerifyError

  const value = useMemo(
    () => ({
      isLoading,
      accessToken,
      user,
      isError,
      loginError,
      logoutError,
      registerError,
      verifyError,
      login: loginFunction,
      register: regsiterFunction,
      logout: logoutFunction,
      verify: verifyFunction,
    }),
    [user, isLoading, isError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = (): AuthContextValue => {
  return useContext(AuthContext);
};
