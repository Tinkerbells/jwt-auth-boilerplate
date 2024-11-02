import { FC } from "react"
import { useAuth } from "@/providers"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

import { InputConform } from "../conform/Input"
import { Button } from "../ui/button"
import { Field, FieldError } from "../ui/field"
import Loader from "../ui/loader"

const ForgotPasswordEmailSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Incorrect format" }),
})

interface ResetPasswordFormProps
  extends React.HTMLAttributes<HTMLFormElement> {}

export const ForgotPasswordForm: FC<ResetPasswordFormProps> = ({
  className,
  ...props
}) => {
  const {
    forgotPassword,
    isLoading,
    isError,
    forgotPasswordError: error,
  } = useAuth()

  const [form, fields] = useForm({
    id: "forgot-password",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ForgotPasswordEmailSchema })
    },
    onSubmit(e) {
      e.preventDefault()
      const form = e.currentTarget
      const formData = new FormData(form)
      const result = parseWithZod(formData, {
        schema: ForgotPasswordEmailSchema,
      })
      if (result.status !== "success") {
        return result.reply()
      }
      forgotPassword({ email: result.value.email })
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
        {isError && <FieldError>{error?.response?.data.message}</FieldError>}
      </Field>
      <Button
        className="w-full"
        variant={"outline"}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? <Loader className="h-5 w-5" /> : "Send email"}
      </Button>
    </form>
  )
}
