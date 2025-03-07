import { Input } from "@/components/ui/input";
import { isValidDateFormat, parseDateString } from "@/lib/utils/date";
import { useState } from "react";

interface DateInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function DateInput({ value, onChange, placeholder = "dd/mm/yyyy" }: DateInputProps) {
  const [inputValue, setInputValue] = useState(value || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (isValidDateFormat(newValue)) {
      const isoDate = parseDateString(newValue);
      onChange?.(isoDate);
    }
  };

  return (
    <Input
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength={10}
    />
  );
}