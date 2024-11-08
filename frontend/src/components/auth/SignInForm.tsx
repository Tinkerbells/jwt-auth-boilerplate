import { FC } from "react"
import { useAuth } from "@/providers"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { Link } from "react-router-dom"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

import { InputConform } from "../conform/Input"
import { Button } from "../ui/button"
import { Field, FieldError } from "../ui/field"
import Loader from "../ui/loader"

const SignInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Incorrect format" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
})

interface SignInFormProps extends React.HTMLAttributes<HTMLFormElement> {}

export const SignInForm: FC<SignInFormProps> = ({ className, ...props }) => {
  const { login, isLoading, isError, loginError: error } = useAuth()
  const [form, fields] = useForm({
    id: "signin",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignInSchema })
    },
    onSubmit(e) {
      e.preventDefault()
      const form = e.currentTarget
      const formData = new FormData(form)
      const result = parseWithZod(formData, { schema: SignInSchema })
      if (result.status !== "success") {
        return result.reply()
      }
      login({ email: result.value.email, password: result.value.password })
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
    >
      <Field>
        <Label htmlFor={fields.email.id} className="sr-only">
          Email
        </Label>
        <InputConform
          meta={fields.email}
          type="text"
          className="w-full"
          placeholder="name@example.com"
          disabled={isLoading}
        />
        {fields.email.errors && <FieldError>{fields.email.errors}</FieldError>}
      </Field>
      <Field>
        <Label htmlFor={fields.email.id} className="sr-only">
          Password
        </Label>
        <InputConform
          meta={fields.password}
          type="password"
          placeholder="password"
          disabled={isLoading}
        />
        {fields.password.errors && (
          <FieldError>{fields.password.errors}</FieldError>
        )}
        {isError && <FieldError>{error?.response?.data.message}</FieldError>}
      </Field>
      <Link
        className="ml-auto inline-block text-sm underline"
        to="/forgot-password"
        replace={true}
      >
        Forgot your password?
      </Link>
      <Button
        className="w-full"
        variant={"outline"}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? <Loader className="h-5 w-5" /> : "Sign in"}
      </Button>
    </form>
  )
}
