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
  variant?: 'success' | 'danger' | 'primary' | 'outline';
}
export const Button = (props: Props) => {
  return (
    <button
      {...props}
      className={`py-2 px-3 rounded-xl flex items-center justify-center ${props.variant === 'success' ? 'bg-green-600' : ''}
     ${props.variant === 'outline' ? 'bg-light-muted dark:bg-dark-muted  border border-light-panel-stroke/40 dark:border-dark-panel-stroke/40  border-opacity-40' : ''} 
     ${props.variant === 'danger' ? 'bg-red-600' : ''}
       ${props.variant === 'primary' ? ' bg-linear-[135deg] from-dark-accent-grad-start to-dark-accent-grad-end text-white' : ''}
    ${props.className ? props.className : ''}`}
    >
      {props.children}
    </button>
  );
};
