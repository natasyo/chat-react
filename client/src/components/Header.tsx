import {Link} from "react-router-dom";

const Header = () => {
    return (
        <div className={`flex justify-between container mx-auto py-2`}>
            <Link to={'/'}>
                <h2>Chat</h2>
            </Link>
            <Link to={'/auth'}>Login</Link>
        </div>
    );
};

export default Header;