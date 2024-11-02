export type User = {
  email: string
  username: string
  password: string
}

export type UserSignInInfo = Omit<User, "username">
export type Profile = Omit<User, "password">

export type ResetPasswordRequestBodyType = {
  newPassword: string
  code: string
}

export interface EmailRequestBody {
  email: string
}

export interface VerifyRequestBody {
  email: string
  code: string
}

export type AuthResponseData = {
  accessToken: string
  profile: Profile
}

export type AxiosErrorResponse = {
  message: string
}
