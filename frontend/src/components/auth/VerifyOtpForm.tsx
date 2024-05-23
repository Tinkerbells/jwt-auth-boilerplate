import { Label } from '@/components/ui/label';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { FC, useEffect, useRef } from 'react';
import { useAuth } from '@/context';
import { Field, FieldError } from '../ui/field';
import { InputOTPConform } from '../conform/InputOTP';
import Loader from '../ui/loader';

const OtpSchema = z.object({
  otp: z.string().min(6, 'Code must be 6 characters long'),
});


interface VerifyOtpFormProps extends React.HTMLAttributes<HTMLFormElement> { }

export const VerifyOtpForm: FC<VerifyOtpFormProps> = ({ className, ...props }) => {
  const { verify, isLoading, isError, verifyError: error } = useAuth()
  const formRef = useRef<HTMLFormElement>(null)
  const [form, fields] = useForm({
    id: 'otp-verify',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: OtpSchema });
    },
    onSubmit(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const result = parseWithZod(formData, { schema: OtpSchema });
      if (result.status !== 'success') {
        return result.reply();
      }
      verify(result.payload.otp as string)
    },
    shouldRevalidate: 'onInput',
  });

  useEffect(() => {
    if (fields.otp.value?.length === 6 && formRef.current) {
      formRef.current.requestSubmit()
    }
  }, [fields])

  return (
    <form
      method="POST"
      id={form.id}
      onSubmit={form.onSubmit}
      className={cn("flex items-center px-12 mt-4", className)}
      {...props}
      ref={formRef}
    >
      {isLoading ? <Loader /> :
        <Field>
          <Label htmlFor={fields.otp.id} className='sr-only'>Code</Label>
          <InputOTPConform meta={fields.otp} />
          {isError && error?.response?.status === 404 && <FieldError>Invalid code</FieldError>}
        </Field>}
    </form>
  )
}
