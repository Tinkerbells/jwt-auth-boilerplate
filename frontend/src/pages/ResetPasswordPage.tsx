import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"

export const ResetPasswordPage = () => {
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
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Reset your password
              </h1>
              <p className="text-sm text-muted-foreground">
                Please enter new password below
              </p>
            </div>
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </>
  )
}
