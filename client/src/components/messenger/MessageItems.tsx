import { useAuthStore } from '../../store/AuthStore.ts';

type Props = {
  messages: { email: string; text: string }[];
  className?: string;
};
export const MessageItems = ({
  messages,
  className,
}: Props) => {
  const userEmail = useAuthStore((state) => state.email);
  return (
    <div className={`${className ?? ''} `}>
      {messages.map((msg, i) => {
        console.log(msg);
        return (
          <div
            key={i}
            className={` ${msg.email === userEmail ? 'text-right' : ''}`}
          >
            <div
              className={` p-2 my-2 border max-w-full inline-block rounded-2xl`}
            >
              <p
                className={`text-sm text-gray-400 italic `}
              >
                {msg.email}
              </p>
              <p>{msg.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
