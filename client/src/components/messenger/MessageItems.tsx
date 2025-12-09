import { useAuthStore } from '../../store/AuthStore.ts';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Message } from '@chat/shared';
import { useSocket } from '../../hooks/useSocket.ts';

type Props = {
  messages: Message[];
  className?: string;
};
export const MessageItems = forwardRef(
  ({ messages, className }: Props, ref) => {
    const userEmail = useAuthStore(
      (state) => state.user?.email,
    );
    const authState = useAuthStore();
    const { socket } = useSocket(authState);

    const containerRef = useRef<HTMLDivElement | null>(
      null,
    );
    const itemsRef = useRef<
      Record<string, HTMLElement | null>
    >({});
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
      const container = containerRef.current;
      if (!container) return;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, [messages.length]);

    useEffect(() => {
      const container = containerRef.current;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id =
                entry.target.getAttribute('data-id');
              if (id && socket) {
                const message = messages.find(
                  (msg) => msg.id === id,
                );
                if (
                  message?.senderEmail !== userEmail &&
                  (message?.state === 'DELIVERED' ||
                    message?.state === 'SENT')
                ) {
                  socket.emit('set_status_read', { id });
                }
              }
            }
          });
        },
        { root: container, threshold: 0.6 },
      );
      messages.map((msg) => {
        const el = itemsRef.current[msg.id];
        if (!el) return;
        observer.observe(el);
      });
      return () => {
        observer.disconnect();
      };
    }, [messages.length, socket]);

    return (
      <div
        className={`${className ?? ''} `}
        ref={containerRef}
      >
        {messages.map((msg) => {
          return (
            <div
              key={msg.id}
              data-id={msg.id}
              ref={(el) => {
                itemsRef.current[msg.id] = el;
              }}
              className={` ${msg.senderEmail === userEmail ? 'text-right' : ''}`}
            >
              <div
                className={` p-2 my-2 border max-w-full inline-block rounded-2xl overflow-hidden`}
              >
                <p
                  className={`text-sm text-gray-400 italic break-words`}
                >
                  {msg.senderEmail}
                </p>
                <div className="flex justify-end relative items-center">
                  <p>{msg.text}</p>
                  {msg.senderEmail === userEmail && (
                    <div>
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={` ms-2 -me-1 text-sm   text-green-800`}
                      />
                      {msg.state === 'READ' && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={` -ms-1 text-sm  text-green-800`}
                        />
                      )}
                    </div>
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
