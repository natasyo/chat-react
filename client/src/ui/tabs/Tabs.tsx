// @flow

import { type ReactElement, useState } from 'react';
import type { TabProps } from './Tab.tsx';
import { Button } from '../Button.tsx';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TabsProps {
  defaultValue?: string;
  children: ReactElement<TabProps>[];
  onRemoveTab?: (value: string) => void;
  onSetActiveTab?: (value: string) => void;
}
export const Tabs = ({
  defaultValue,
  children,
  onRemoveTab,
  onSetActiveTab,
}: TabsProps) => {
  const [active, setActive] = useState<string>(
    defaultValue ?? children[0].props.value,
  );

  return (
    <div className={`flex-1 flex flex-col min-h-0`}>
      <div className={`flex my-3`}>
        {children.map((child: ReactElement<TabProps>) => (
          <div
            key={child.props.value}
            className={`pe-3 rounded-lg  mt-2 mx-0.5 relative ${child.props.value === active ? 'bg-linear-[135deg] from-dark-accent-grad-start to-dark-accent-grad-end text-white' : 'border border-light-panel-stroke dark:border-dark-panel-stroke'}`}
          >
            <Button
              className={`mx-1  px-5`}
              onClick={() => {
                if (onSetActiveTab) {
                  onSetActiveTab(child.props.value);
                }
                setActive(child.props.value);
              }}
            >
              {child.props.label}
            </Button>
            <button
              className={`absolute right-0 top-0`}
              onClick={() => {
                onRemoveTab &&
                  onRemoveTab(child.props.value);
              }}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className={'text-red-600 text-lg ms-2'}
              />
            </button>
          </div>
        ))}
      </div>
      <div className={`flex-1 min-h-0 flex flex-col`}>
        {
          children.find(
            (child) => child.props.value === active,
          )?.props.children
        }
      </div>
    </div>
  );
};
