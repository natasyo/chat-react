// @flow
import * as React from 'react';

export interface TabProps {
  children?: React.ReactNode;
  label: string;
  value: string;
  className?: string;
  isOnline?: boolean;
}

export function Tab({ children, className }: TabProps) {
  return (
    <div className={`${className ? className : ''}`}>
      {children}
    </div>
  );
}
