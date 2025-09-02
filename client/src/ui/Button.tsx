// @flow

import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
} from 'react';

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: 'success' | 'danger' | 'primary';
}
export const Button = (props: Props) => {
  return (
    <button
      {...props}
      className={`py-2 px-6 rounded-xl my-5 ${props.variant === 'success' ? 'bg-green-600' : ''}
     ${props.variant === 'danger' ? 'bg-red-600' : ''}
       ${props.variant === 'primary' ? 'bg-blue-600' : ''}
    ${props.className ? props.className : ''}`}
    >
      {props.children}
    </button>
  );
};
