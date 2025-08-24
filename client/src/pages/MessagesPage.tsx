import {useEffect, useState} from 'react';
import {io, Socket} from "socket.io-client";

const MessagesPage = () => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<string[]>([])
    const [socket, setSocket] = useState<Socket
        |null>(null)
    useEffect(() => {
        const newSocket=io("http://localhost:3000");
        setSocket(newSocket);
        newSocket.on('message',(msg)=>{
            setMessages(pev=>[...pev, msg]);
        });
         return () => {newSocket.disconnect()}
    }, []);
    const sendMessage=()=>{
        if(socket&&input.trim()){
            socket.emit('message', input);
            setInput('')
        }
    }
    return (
        <div className={`container mx-auto h-full`}>
            {messages.map((msg,i)=>(
                <div key={i}>{msg}</div>
            ))}
            <textarea className={`block border-2 border-blue-900 outline-0 rounded-xl w-full max-w-full h-1/4`} value={input} onChange={(e)=>
                setInput(e.target.value)
            }
            onKeyDown={e=>e.key==="Enter"&&sendMessage()}>
            </textarea>
            <button className={`block`} onClick={sendMessage}>
                Send
            </button>
        </div>
    );
};

export default MessagesPage;