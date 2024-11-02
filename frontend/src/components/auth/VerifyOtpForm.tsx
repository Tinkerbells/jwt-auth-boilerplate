import { FC, useEffect, useRef } from "react"
import ROUTES from "@/consts/routes"
import { useAuth } from "@/providers"
import { VERIFY_ROUTE, VerifyRouteEnumType } from "@/types"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { useCookies } from "react-cookie"
import { Navigate } from "react-router-dom"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

import { InputOTPConform } from "../conform/InputOTP"
import { Field, FieldError } from "../ui/field"
import Loader from "../ui/loader"

const VerifyOtpSchema = z.object({
  code: z.string().min(6, "Code must be 6 characters long"),
})

interface VerifyOtpFormProps extends React.HTMLAttributes<HTMLFormElement> {
  type: VerifyRouteEnumType
}

export const VerifyOtpForm: FC<VerifyOtpFormProps> = ({
  className,
  type,
  ...props
}) => {
  const [emailCookie] = useCookies(["email"])
  const {
    verifyEmail,
    handleResetCode,
    isLoading,
    isError,
    handleResetCodeError,
    verifyEmailError,
  } = useAuth()
  const error =
    type === VERIFY_ROUTE.RESET ? handleResetCodeError : verifyEmailError
  const callback = type === VERIFY_ROUTE.RESET ? handleResetCode : verifyEmail
  const formRef = useRef<HTMLFormElement>(null)
  const [form, fields] = useForm({
    id: "email-verify",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyOtpSchema })
    },
    onSubmit(e) {
      e.preventDefault()
      const form = e.currentTarget
      const formData = new FormData(form)
      const result = parseWithZod(formData, { schema: VerifyOtpSchema })
      if (result.status !== "success") {
        return result.reply()
      }
      callback({
        code: result.value.code,
        email: emailCookie.email,
      })
    },
    shouldRevalidate: "onInput",
  })

  useEffect(() => {
    if (fields.code.value?.length === 6 && formRef.current) {
      formRef.current.requestSubmit()
    }
  }, [fields])

  if (!emailCookie.email) {
    return <Navigate to={ROUTES.SIGN_IN} />
  }
  return (
    <form
      method="POST"
      id={form.id}
      onSubmit={form.onSubmit}
      className={cn("mt-4 flex items-center px-12", className)}
      {...props}
      ref={formRef}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Field>
          <Label htmlFor={fields.code.id} className="sr-only">
            Code
          </Label>
          <InputOTPConform meta={fields.code} />
          {isError && <FieldError>{error?.response?.data.message}</FieldError>}
        </Field>
      )}
    </form>
  )
}
