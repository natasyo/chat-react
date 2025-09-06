import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/AuthStore.tsx';

const MessagesPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { email: string; text: string }[]
  >([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const authStore = useAuthStore();
  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      auth: {
        token: authStore.jwt,
      },
    });
    setSocket(newSocket);
    newSocket.on(
      'message',
      (msg: { email: string; text: string }) => {
        console.log(msg);
        setMessages((pev) => [...pev, msg]);
      },
    );
    return () => {
      newSocket.disconnect();
    };
  }, []);
  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.emit('message', {
        text: input,
        email: authStore.email,
      });
      setInput('');
    }
  };
  return (
    <div className={`container mx-auto h-full`}>
      {messages.map((msg, i) => (
        <div
          key={i}
          className={` ${msg.email === authStore.email ? 'text-right' : ''}`}
        >
          <div
            className={` p-2 my-2 border max-w-full inline-block rounded-2xl`}
          >
            <p className={`text-sm text-gray-400 italic `}>
              {msg.email}
            </p>
            <p>{msg.text}</p>
          </div>
        </div>
      ))}

      <textarea
        className={`block border-2 border-blue-900 outline-0 rounded-xl w-full max-w-full h-1/4`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) =>
          e.key === 'Enter' && sendMessage()
        }
      ></textarea>
      <button className={`block`} onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default MessagesPage;
