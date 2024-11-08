import ROUTES from "@/consts/routes"
import { VERIFY_ROUTE, VerifyRouteType } from "@/types"
import { Link, Navigate, useParams } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Toaster } from "@/components/ui/toaster"
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm"

export const VerifyOtpPage = () => {
  const { type } = useParams<VerifyRouteType>()
  if (!type) {
    return <Navigate to={ROUTES.SIGN_IN} />
  }
  if (!Object.values(VERIFY_ROUTE).includes(type)) {
    return <Navigate to={ROUTES.SIGN_IN} />
  }
  return (
    <>
      <div className="container relative grid h-[100vh] max-w-none items-center justify-center lg:px-0">
        <div className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-8">
          <Link to="/sign-in" className={buttonVariants({ variant: "ghost" })}>
            Sign in
          </Link>
          <ModeToggle />
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col items-center justify-center sm:w-[450px]">
            <div className="flex flex-col items-center space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Type code
              </h1>
              <p className="text-sm text-muted-foreground">
                Please enter the verification code sent to your email.
              </p>
            </div>
            <VerifyOtpForm type={type} />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
