import {useState} from "react";

const LoginPage = () => {
    const [email, setEmail] = useState<string|undefined>()
    const [password, setPassword] = useState<string|undefined>()
    return (
        <div>
            <input type="text" className={`block`} placeholder={'Email'} onChange={(e) => setEmail(e.target.value)}  value={email} />

        </div>
    );
};

export default LoginPage;