import { createContext, ReactNode, useContext, useEffect, useMemo } from "react"
import ROUTES from "@/consts/routes"
import {
  fetchResetPasswordCode,
  fetchVerify,
  forgotPassword,
  logout as logoutUser,
  resetPassword,
  signIn,
  signUp,
} from "@/services/auth"
import {
  AuthResponseData,
  AxiosErrorResponse,
  EmailRequestBody,
  Profile,
  ResetPasswordRequestBodyType,
  User,
  UserSignInInfo,
  VerifyRequestBody,
} from "@/types"
import { AxiosError } from "axios"
import { useCookies } from "react-cookie"
import { UseMutateFunction, useMutation } from "react-query"
import { useLocation, useNavigate } from "react-router-dom"

import useLocalStorage from "@/hooks/useLocalStorage"
import { useToast } from "@/components/ui/use-toast"

// React query keys for future refetching
const SIGN_IN_QUERY_KEY = ["sign-in"]
const SIGN_UP_QUERY_KEY = ["sign-up"]
const LOGOUT_QUERY_KEY = ["logout"]
const VERIFY_QUERY_KEY = ["verify"]
const RESET_PASSWORD_QUERY_KEY = ["reset-password"]
const RESET_PASSWORD_CHECK_CODE_QUERY_KEY = ["reset-password-code"]
const FORGOT_PASSWORD_QUERY_KEY = ["forgot-password"]

export interface AuthContextValue {
  loginError: AxiosError<AxiosErrorResponse> | null
  logoutError: AxiosError<AxiosErrorResponse> | null
  registerError: AxiosError<AxiosErrorResponse> | null
  verifyEmailError: AxiosError<AxiosErrorResponse> | null
  forgotPasswordError: AxiosError<AxiosErrorResponse> | null
  resetPasswordError: AxiosError<AxiosErrorResponse> | null
  handleResetCodeError: AxiosError<AxiosErrorResponse> | null
  isError: boolean
  isLoading: boolean
  accessToken: string | null
  user: Profile | null
  login: UseMutateFunction<
    AuthResponseData,
    AxiosError<AxiosErrorResponse>,
    UserSignInInfo
  >
  register: UseMutateFunction<
    { message: string },
    AxiosError<AxiosErrorResponse>,
    User
  >
  logout: UseMutateFunction<void, AxiosError<AxiosErrorResponse>, void>
  verifyEmail: UseMutateFunction<
    void,
    AxiosError<AxiosErrorResponse>,
    VerifyRequestBody
  >
  forgotPassword: UseMutateFunction<
    void,
    AxiosError<AxiosErrorResponse>,
    EmailRequestBody
  >
  resetPassword: UseMutateFunction<
    void,
    AxiosError<AxiosErrorResponse>,
    ResetPasswordRequestBodyType
  >
  handleResetCode: UseMutateFunction<
    void,
    AxiosError<AxiosErrorResponse>,
    VerifyRequestBody
  >
}

export const AuthContext = createContext<AuthContextValue>({
  isError: false,
  loginError: null,
  logoutError: null,
  registerError: null,
  verifyEmailError: null,
  forgotPasswordError: null,
  resetPasswordError: null,
  handleResetCodeError: null,
  isLoading: false,
  accessToken: null,
  user: null,
  login: () => {}, // Placeholder for login function
  register: () => {}, // Placeholder for register function
  logout: () => {}, // Placeholder for logout function
  verifyEmail: () => {}, // Placeholder for verify function
  forgotPassword: () => {}, // Placeholder for forgot password function
  resetPassword: () => {}, // Placeholder for reset password function
  handleResetCode: () => {}, // Placeholder for check reset password code function
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { toast } = useToast()
  const [user, setUser] = useLocalStorage<Profile | null>("user", null)
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    "accessToken",
    null
  )
  const [, setEmailCookie, removeEmailCookie] = useCookies(["email"])
  const [, setResetCodeCookie, removeResetCodeCookie] = useCookies([
    "reset-code",
  ])

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (
      user &&
      (location.pathname === "/sign-up" || location.pathname === "/sign-in")
    ) {
      navigate("/")
    }
  }, [user])

  const login = useMutation<
    AuthResponseData,
    AxiosError<AxiosErrorResponse>,
    UserSignInInfo
  >(SIGN_IN_QUERY_KEY, signIn, {
    onSuccess: (data) => {
      setUser(data.profile)
      setAccessToken(data.accessToken)
      navigate("/")
    },
    onError: (error) => {
      console.log(error.response?.data)
      // console.error(error)
    },
  })

  const register = useMutation<
    { message: string },
    AxiosError<AxiosErrorResponse>,
    User
  >(LOGOUT_QUERY_KEY, signUp, {
    onSuccess: (_, request) => {
      removeEmailCookie("email")
      setEmailCookie("email", request.email.toString(), {
        expires: new Date(new Date().getTime() + 10 * 60 * 1000), // expires after 10 minutes
        sameSite: "strict",
      })
      navigate(ROUTES.VERIFY + "/email")
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
  })

  const logout = useMutation<void, AxiosError<AxiosErrorResponse>, void>(
    SIGN_UP_QUERY_KEY,
    logoutUser,
    {
      onSuccess: () => {
        setUser(null)
        setAccessToken(null)
        navigate(ROUTES.SIGN_IN, { replace: true })
      },
      onError: (error) => {
        console.error(error)
      },
    }
  )

  const verifyEmail = useMutation<
    void,
    AxiosError<AxiosErrorResponse>,
    VerifyRequestBody
  >(VERIFY_QUERY_KEY, fetchVerify, {
    onSuccess: () => {
      navigate(ROUTES.SIGN_IN, { replace: true })
    },
    onError: (error) => {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    },
  })

  const forgot = useMutation<
    void,
    AxiosError<AxiosErrorResponse>,
    EmailRequestBody
  >(FORGOT_PASSWORD_QUERY_KEY, forgotPassword, {
    onSuccess: (_, request) => {
      removeEmailCookie("email", {
        sameSite: "strict",
      })
      setEmailCookie("email", request.email.toString(), {
        sameSite: "strict",
        expires: new Date(new Date().getTime() + 10 * 60 * 1000), // lives for 10 minutes
      })
      navigate(ROUTES.VERIFY + "/reset")
    },
    onError: (error) => {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    },
  })

  const reset = useMutation<
    void,
    AxiosError<AxiosErrorResponse>,
    ResetPasswordRequestBodyType
  >(RESET_PASSWORD_QUERY_KEY, resetPassword, {
    onSuccess: () => {
      navigate(ROUTES.SIGN_IN, { replace: true })
    },
    onError: (error) => {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    },
  })

  const checkResetCode = useMutation<
    void,
    AxiosError<AxiosErrorResponse>,
    VerifyRequestBody
  >(RESET_PASSWORD_CHECK_CODE_QUERY_KEY, fetchResetPasswordCode, {
    onSuccess: (_, request) => {
      console.log("@")
      removeResetCodeCookie("reset-code", {
        sameSite: "strict",
      })
      setResetCodeCookie("reset-code", request.code.toString(), {
        sameSite: "strict",
        expires: new Date(new Date().getTime() + 3 * 60 * 1000), // lives for 3 minutes
      })
      navigate(ROUTES.RESET_PASSWORD)
    },
    onError: (error) => {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    },
  })

  const {
    mutate: loginFunction,
    isLoading: isLoginLoading,
    isError: isLoginError,
    error: loginError,
  } = login
  const {
    mutate: logoutFunction,
    isLoading: isLogoutLoading,
    isError: isLogoutError,
    error: logoutError,
  } = logout
  const {
    mutate: regsiterFunction,
    isLoading: isRegisterLoading,
    isError: isRegisterError,
    error: registerError,
  } = register
  const {
    mutate: verifyEmailFunction,
    isLoading: isVerifyEmailLoading,
    isError: isVerifyEmailError,
    error: verifyEmailError,
  } = verifyEmail
  const {
    mutate: forgotPasswordFunction,
    isLoading: isForgotPasswordLoading,
    isError: isForgotPasswordError,
    error: forgotPasswordError,
  } = forgot
  const {
    mutate: resetPasswordFunction,
    isLoading: isResetPasswordLoading,
    isError: isResetPasswordError,
    error: resetPasswordError,
  } = reset
  const {
    mutate: handleResetCodeFunction,
    isLoading: isCheckResetCodeLoading,
    isError: isCheckResetCodeError,
    error: handleResetCodeError,
  } = checkResetCode

  const isLoading =
    isLoginLoading ||
    isLogoutLoading ||
    isRegisterLoading ||
    isVerifyEmailLoading ||
    isForgotPasswordLoading ||
    isResetPasswordLoading ||
    isCheckResetCodeLoading

  const isError =
    isLoginError ||
    isLogoutError ||
    isRegisterError ||
    isVerifyEmailError ||
    isForgotPasswordError ||
    isResetPasswordError ||
    isCheckResetCodeError

  const value = useMemo(
    () => ({
      isLoading,
      accessToken,
      user,
      isError,
      loginError,
      logoutError,
      registerError,
      verifyEmailError,
      forgotPasswordError,
      resetPasswordError,
      handleResetCodeError,
      login: loginFunction,
      register: regsiterFunction,
      logout: logoutFunction,
      verifyEmail: verifyEmailFunction,
      forgotPassword: forgotPasswordFunction,
      resetPassword: resetPasswordFunction,
      handleResetCode: handleResetCodeFunction,
    }),
    [user, isLoading, isError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  return useContext(AuthContext)
}
