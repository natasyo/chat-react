import { useAuthStore } from '../../store/AuthStore.ts';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  messages: { email: string; text: string }[];
  className?: string;
};
export const MessageItems = forwardRef(
  ({ messages, className }: Props, ref) => {
    const userEmail = useAuthStore(
      (state) => state.user?.email,
    );

    const containerRef = useRef<HTMLDivElement | null>(
      null,
    );

    useImperativeHandle(ref, () => ({
      scrollToBottom: (smooth = false) => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto',
          });
        }
      },
    }));
    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop =
          containerRef.current.scrollHeight;
      }
    }, [messages.length]);
    return (
      <div
        className={`${className ?? ''} `}
        ref={containerRef}
      >
        {messages.map((msg, i) => {
          return (
            <div
              key={i}
              className={` ${msg.email === userEmail ? 'text-right' : ''}`}
            >
              <div
                className={` p-2 my-2 border max-w-full inline-block rounded-2xl overflow-hidden`}
              >
                <p
                  className={`text-sm text-gray-400 italic break-words`}
                >
                  {msg.email}
                </p>
                <div className="flex justify-end relative items-center">
                  <p>{msg.text}</p>
                  {msg.email === userEmail && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={` ms-2 text-sm  text-green-800`}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
MessageItems.displayName = 'MessageItems';
