// @flow

import type { HTMLProps } from 'react';
import type { FieldError } from 'react-hook-form';

interface Props extends HTMLProps<HTMLInputElement> {
  error?: FieldError;
}
export const Input = (props: Props) => {
  return (
    <div>
      <input
        {...props}
        className={`block ${props.error ? 'border-red-700' : 'border-green-900 dark:border-amber-300 '} border w-96  p-2 rounded-2xl my-2 
        ${props.className ? props.className : ''} `}
      />
      {props.error && (
        <p className={`text-red-600`}>
          {props.error.message}
        </p>
      )}
    </div>
  );
};
