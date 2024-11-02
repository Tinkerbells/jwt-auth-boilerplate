const ROUTES = {
  VERIFY: "/verify",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const

export type RouteType = keyof typeof ROUTES

export default ROUTES
