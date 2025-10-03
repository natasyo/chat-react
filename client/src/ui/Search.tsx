// @flow
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

type Props = {};
export const Search = (props: Props) => {
  return (
    <div
      className={`flex items-center border-2 border-light-panel-stroke/50 dark:border-dark-panel-stroke/40 outline-0 rounded-xl p-2`}
    >
      <input
        type={`text`}
        className={`focus-visible:outline-0 p-1`}
        {...props}
      />
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className={
          'text-light-text-secondary dark:text-dark-text-secondary text-2xl ms-2'
        }
        width={80}
      />
    </div>
  );
};
