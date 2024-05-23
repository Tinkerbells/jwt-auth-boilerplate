import {
  type FieldMetadata,
  unstable_useControl as useControl,
} from '@conform-to/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { type ElementRef, useRef, useEffect } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';

export function InputOTPConform({
  meta,
  pattern = REGEXP_ONLY_DIGITS,
}: {
  meta: FieldMetadata<string>;
  pattern?: string;
}) {

  const inputOTPRef = useRef<ElementRef<typeof InputOTP>>(null);
  const control = useControl(meta);

  useEffect(() => {
    inputOTPRef.current?.focus()
  }, [])

  return (
    <>
      <input
        ref={control.register}
        name={meta.name}
        defaultValue={meta.initialValue}
        tabIndex={-1}
        className="sr-only"
        onFocus={() => {
          inputOTPRef.current?.focus();
        }}
      />
      <InputOTP
        ref={inputOTPRef}
        value={control.value ?? ''}
        onChange={control.change}
        onBlur={control.blur}
        maxLength={6}
        pattern={pattern}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP >
    </>
  );
}
