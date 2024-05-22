export type User = {
  email: string
  username: string
  password: string
}

export type UserSignInInfo = Omit<User, "username">
export type Profile = Omit<User, "password">

