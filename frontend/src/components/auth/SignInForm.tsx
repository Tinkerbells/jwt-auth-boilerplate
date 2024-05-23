import { Label } from '@/components/ui/label';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { InputConform } from '../conform/Input';
import { Button } from '../ui/button';
import Loader from '../ui/loader';
import { UserSignInInfo } from '@/types';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import { useAuth } from '@/context';
import { Field, FieldError } from '../ui/field';

const UserSubscriptionSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email({ message: "Incorrect format" }),
  password: z.string({ required_error: 'Password is required' }).min(8, { message: "Password must be at least 8 characters long" }),
});


interface SignInFormProps extends React.HTMLAttributes<HTMLFormElement> { }

export const SignInForm: FC<SignInFormProps> = ({ className, ...props }) => {
  const { login, isLoading, isError, loginError: error } = useAuth()
  const [form, fields] = useForm({
    id: 'signin',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UserSubscriptionSchema });
    },
    onSubmit(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const result = parseWithZod(formData, { schema: UserSubscriptionSchema });
      if (result.status !== 'success') {
        return result.reply();
      }
      login(result.payload as UserSignInInfo)
    },
    shouldRevalidate: 'onInput',
  });

  return (
    <form
      method="POST"
      id={form.id}
      onSubmit={form.onSubmit}
      className={cn("flex flex-col items-center gap-4 px-12 mt-6 w-full", className)}
      {...props}
    >
      <Field>
        <Label htmlFor={fields.email.id} className='sr-only'>Email</Label>
        <InputConform meta={fields.email} type="text" className='w-full' placeholder='name@example.com' disabled={isLoading} />
        {fields.email.errors && <FieldError>{fields.email.errors}</FieldError>}
      </Field>
      <Field>
        <Label htmlFor={fields.email.id} className='sr-only'>Password</Label>
        <InputConform meta={fields.password} type="password" placeholder='password' disabled={isLoading} />
        {fields.password.errors && <FieldError>{fields.password.errors}</FieldError>}
        {isError && error?.response?.status === 401 && <FieldError>Incorrect password</FieldError>}
      </Field>
      <Button className='w-full' variant={"outline"} type='submit' disabled={isLoading}>
        {isLoading ? <Loader className='w-5 h-5' /> : "Sign in"}
      </Button>
    </form>
  )
}
