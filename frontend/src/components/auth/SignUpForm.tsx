import { Field, FieldError } from '../ui/field';
import { Label } from '@/components/ui/label';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { FC, useState } from 'react';
import { EvaluatePasswordStrengthType, evaluatePasswordStrength } from '@/utils';
import { InputConform } from '../conform/Input';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { User } from '@/types';
import Loader from '../ui/loader';
import { useAuth } from '@/context';

const UserSubscriptionSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email({ message: "Incorrect format" }),
  username: z.string({ required_error: 'Username is required' }),
  password: z.string({ required_error: 'Password is required' }).min(8, { message: "Password must be at least 8 characters long" }),
});

interface SignUpFormProps extends React.HTMLAttributes<HTMLFormElement> { }

export const SignUpForm: FC<SignUpFormProps> = ({ className, ...props }) => {
  const { register, isLoading, isError, registerError: error } = useAuth()
  const [strength, setStrength] = useState<EvaluatePasswordStrengthType>({
    value: 0,
    color: ""
  }
  )
  const [form, fields] = useForm({
    id: 'signup',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UserSubscriptionSchema });
    },
    onSubmit(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const result = parseWithZod(formData, { schema: UserSubscriptionSchema });
      register(result.payload as User)
    },
    shouldRevalidate: 'onInput',
  });

  console.log(error?.response?.status)
  return (
    <form
      method="POST"
      id={form.id}
      onSubmit={form.onSubmit}
      className={cn("flex flex-col items-center gap-4 px-12 mt-6 w-full", className)} {...props}
      {...props}
    >
      <Field>
        <Label htmlFor={fields.email.id} className='sr-only'>Email</Label>
        <InputConform meta={fields.email} type="text" className='w-full' placeholder='name@example.com' disabled={isLoading} />
        {fields.email.errors && <FieldError>{fields.email.errors}</FieldError>}
        {isError && error?.response?.status === 409 && <FieldError>Email already exist</FieldError>}
      </Field>
      <Field>
        <Label htmlFor={fields.username.id} className='sr-only'>Username</Label>
        <InputConform meta={fields.username} type="text" placeholder='username' className='w-full' disabled={isLoading} />
        {fields.username.errors && <FieldError>{fields.username.errors}</FieldError>}
      </Field>
      <Field>
        <Label htmlFor={fields.email.id} className='sr-only'>Password</Label>
        <InputConform meta={fields.password} type="password" placeholder='password' disabled={isLoading} onChange={(e) => {
          const password = e.target.value
          console.log(strength)
          setStrength(evaluatePasswordStrength(password))
        }} />
        {fields.password.errors && <FieldError>{fields.password.errors}</FieldError>}
        <Progress max={100} value={strength.value} className="h-2" indicatorColor={strength.color} />
      </Field>
      <Button className='w-full' variant={"outline"} type='submit' disabled={isLoading}>
        {isLoading ? <Loader className='w-5 h-5' /> : "Sign up"}
      </Button>
    </form>
  )
}
