import React, {type ReactNode} from "react";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

type LayoutProps = {
    children:ReactNode
};

const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div className={`flex flex-col w-full justify-between h-full`}>
            <Header/>
            <div className="grow">
                {children}
            </div>
            <Footer/>
        </div>
    );
};

export default Layout;
