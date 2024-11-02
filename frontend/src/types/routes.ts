export const VERIFY_ROUTE = {
  RESET: "reset",
  EMAIL: "email",
} as const

export type VerifyRouteEnumType =
  (typeof VERIFY_ROUTE)[keyof typeof VERIFY_ROUTE]

export type VerifyRouteType = {
  type: VerifyRouteEnumType
}
