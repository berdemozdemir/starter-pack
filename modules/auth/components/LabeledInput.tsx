'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';

type LabeledInputProps = {
  label: string;
  isPasswordField?: boolean;
} & React.ComponentProps<typeof Input>;

export const LabeledInput = ({
  label,
  isPasswordField = false,
  ...props
}: LabeledInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="group relative">
      <Input
        className="peer h-12 border px-3 pt-5"
        type={isPasswordField ? (showPassword ? 'text' : 'password') : 'text'}
        placeholder=" "
        {...props}
      />

      <FormLabel
        className={`absolute top-1/2 left-3 -translate-y-1/2 transform text-[#62748E] transition-all duration-200 ease-out group-focus-within:top-2 group-focus-within:translate-y-0 group-focus-within:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs`}
      >
        {label}
      </FormLabel>

      {isPasswordField &&
        (showPassword ? (
          <EyeOff
            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
            color="#62748E"
            size={18}
            onClick={togglePasswordVisibility}
          />
        ) : (
          <Eye
            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
            size={18}
            color="#62748E"
            onClick={togglePasswordVisibility}
          />
        ))}
    </div>
  );
};
