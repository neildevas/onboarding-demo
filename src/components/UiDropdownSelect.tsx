import React from 'react';
import { Select } from '@chakra-ui/react';
import { FormOption } from "../types/onboarding";

type Props = {
  options: FormOption[];
  onChange: (val: string) => void;
}

const UiDropdownSelect: React.FC<Props> = ({ options, onChange }) => {
  return (
    <Select placeholder='Select option' onChange={e => onChange(e.target.value)}>
      {options.map(({ value, title }) => (
        <option value={value} key={value}>{title}</option>
      ))}
    </Select>
  )
}
export default UiDropdownSelect;
