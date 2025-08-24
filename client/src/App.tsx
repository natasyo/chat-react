import './App.css'
import MessagesPage from "./pages/MessagesPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AuthPage from "./pages/AuthPage.tsx";
import Layout from "./Layout.tsx";

function App() {

    return (
        <>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<MessagesPage/>}/>
                        <Route path='/auth' element={<AuthPage/>}/>
                    </Routes>
                </Layout>
            </BrowserRouter>
        </>
    )
}

export default App
