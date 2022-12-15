import type { FC } from 'react';

import { DatePicker } from '@mantine/dates';

interface FormDatePickerProps {
  path: 'start' | 'end';
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: Date) => void;
}

const FormDatePicker: FC<FormDatePickerProps> = ({
  path,
  value,
  minDate,
  maxDate,
  onChange,
}) => {
  const label = path === 'start' ? 'From' : 'To';

  return (
    <DatePicker
      label={label}
      firstDayOfWeek="sunday"
      value={value}
      minDate={minDate}
      maxDate={maxDate}
      onChange={value => {
        if (value) {
          onChange(value);
        }
      }}
    />
  );
};

export default FormDatePicker;
