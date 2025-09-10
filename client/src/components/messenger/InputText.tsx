import { Button } from '../../ui/Button.tsx';
import SendImage from '../../assets/send.png';
import { useState } from 'react';

type Props = {
  sendMessage: (text: string) => void;
};
export const InputText = ({ sendMessage }: Props) => {
  const [input, setInput] = useState('');
  return (
    <div className="flex items-center border-2 border-light-panel-stroke/50 dark:border-dark-panel-stroke/40 outline-0 rounded-xl p-2">
      <textarea
        className={`block w-full max-w-full me-3 resize-none focus:outline-none`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(input);
            setInput('');
          }
        }}
      ></textarea>
      <Button
        variant={'primary'}
        className={`h-10 w-10 !m-0 !p-0 flex`}
        onClick={() => {
          sendMessage(input);
          setInput('');
        }}
      >
        <img src={SendImage} alt="send" />
      </Button>
    </div>
  );
};
