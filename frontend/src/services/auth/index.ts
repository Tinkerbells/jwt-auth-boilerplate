import { apiClient } from "@/api"
import {
  AuthResponseData,
  EmailRequestBody,
  ResetPasswordRequestBodyType,
  User,
  UserSignInInfo,
  VerifyRequestBody,
} from "@/types"

const resetPassword = async (
  req: ResetPasswordRequestBodyType
): Promise<void> => {
  const { data } = await apiClient.post(`/api/v1/reset-password`, req)
  return data
}

const fetchResetPasswordCode = async (
  req: VerifyRequestBody
): Promise<void> => {
  const { data } = await apiClient.post(`/api/v1/check-reset-code`, req)
  console.log(data)
  return data
}

const forgotPassword = async (req: EmailRequestBody): Promise<void> => {
  const { data } = await apiClient.post(`/api/v1/forgot-password`, req)
  return data
}

const fetchVerify = async (req: VerifyRequestBody): Promise<void> => {
  const { data } = await apiClient.post(`/api/v1/verify-email`, req)
  return data
}

const logout = async (): Promise<void> => {
  const { data } = await apiClient.post(`/api/v1/auth/logout`)
  return data
}

const signIn = async (user: UserSignInInfo): Promise<AuthResponseData> => {
  const { data } = await apiClient.post<AuthResponseData>(
    `/api/v1/auth/login`,
    user
  )
  return data
}

const signUp = async (credentials: User): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>(
    `/api/v1/auth/signup`,
    credentials
  )
  return data
}

export {
  signIn,
  signUp,
  logout,
  fetchVerify,
  forgotPassword,
  resetPassword,
  fetchResetPasswordCode,
}
