import { FC, useEffect, useState } from "react"
import ROUTES from "@/consts/routes"
import { useAuth } from "@/providers"
import { evaluatePasswordStrength, EvaluatePasswordStrengthType } from "@/utils"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { useCookies } from "react-cookie"
import { Navigate } from "react-router-dom"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

import { InputConform } from "../conform/Input"
import { Button } from "../ui/button"
import { Field, FieldError } from "../ui/field"
import Loader from "../ui/loader"
import { Progress } from "../ui/progress"

const ResetPassowrdSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirm: z.string({ required_error: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  })

interface ResetPasswordFormProps
  extends React.HTMLAttributes<HTMLFormElement> {}

export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({
  className,
  ...props
}) => {
  const [resetCodeCookie] = useCookies(["reset-code"])
  const {
    resetPassword,
    isLoading,
    isError,
    resetPasswordError: error,
  } = useAuth()
  const [strength, setStrength] = useState<EvaluatePasswordStrengthType>({
    value: 0,
    color: "",
  })
  const [form, fields] = useForm({
    id: "sign-up",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ResetPassowrdSchema })
    },
    onSubmit(e) {
      e.preventDefault()
      const form = e.currentTarget
      const formData = new FormData(form)
      const result = parseWithZod(formData, { schema: ResetPassowrdSchema })
      if (result.status !== "success") {
        return result.reply()
      }
      resetPassword({
        newPassword: result.value.password,
        code: resetCodeCookie["reset-code"].toString(),
      })
    },
    shouldRevalidate: "onInput",
  })

  return (
    <form
      method="POST"
      id={form.id}
      onSubmit={form.onSubmit}
      className={cn(
        "mt-6 flex w-full flex-col items-center gap-4 px-12",
        className
      )}
      {...props}
      {...props}
    >
      <Field>
        <Label htmlFor={fields.password.id} className="sr-only">
          Password
        </Label>
        <InputConform
          meta={fields.password}
          type="password"
          placeholder="password"
          disabled={isLoading}
          onChange={(e) => {
            const password = e.target.value
            setStrength(evaluatePasswordStrength(password))
          }}
        />
        {fields.password.errors && (
          <FieldError>{fields.password.errors}</FieldError>
        )}
        <Progress
          max={100}
          value={strength.value}
          className="h-2"
          indicatorColor={strength.color}
        />
      </Field>
      <Field>
        <Label htmlFor={fields.confirm.id} className="sr-only">
          Confirm password
        </Label>
        <InputConform
          meta={fields.confirm}
          type="password"
          placeholder="confirm password"
          disabled={isLoading}
          onChange={(e) => {
            const password = e.target.value
            setStrength(evaluatePasswordStrength(password))
          }}
        />
        {fields.confirm.errors && (
          <FieldError>{fields.confirm.errors}</FieldError>
        )}
        {isError && <FieldError>{error?.response?.data.message}</FieldError>}
      </Field>
      <Button
        className="w-full"
        variant={"outline"}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? <Loader className="h-5 w-5" /> : "Reset password"}
      </Button>
    </form>
  )
}
