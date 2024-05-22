import { Field, FieldError } from '@/components/Field';
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

const UserSubscriptionSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email({ message: "Incorrect format" }),
  password: z.string({ required_error: 'Password is required' }).min(8, { message: "Password must be at least 8 characters long" }),
});


interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> { }

export const SignInForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const { login, isLoading } = useAuth()
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
      login(result.payload as UserSignInInfo)
    },
    shouldRevalidate: 'onInput',
  });
  if (isLoading) {
    return <Loader />
  }
  return (
    <form
      method="POST"
      id={form.id}
      onSubmit={form.onSubmit}
      className={cn("flex flex-col items-center gap-4 px-12 py-2 mt-4 w-full", className)} {...props}
      {...props}
    >
      <Field>
        <Label htmlFor={fields.email.id} className='sr-only'>Email</Label>
        <InputConform meta={fields.email} type="text" className='w-full' placeholder='name@example.com' />
        {fields.email.errors && <FieldError>{fields.email.errors}</FieldError>}
      </Field>
      <Field>
        <Label htmlFor={fields.email.id} className='sr-only'>Password</Label>
        <InputConform meta={fields.password} type="password" placeholder='password' />
        {fields.password.errors && <FieldError>{fields.password.errors}</FieldError>}
      </Field>
      <Button className='w-full' variant={"outline"} type='submit' disabled={isLoading}>Sign in</Button>
    </form>
  )
}
