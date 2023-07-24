import "./styles/App.css";
import { BrowserRouter as Router, Routes,  Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import Account from "./pages/Account";
import NotFound from "./components/NotFound";
import HomeProvider from "./context/HomeContext";



const App = () => 
{
    const [cookie] = useCookies(["token"]);

    return (
        <div className="App">
            <div className="home-background"/>
            <Router>
                <Routes>
                    <Route path="/" element={cookie.token ? <Navigate replace to="/home/today"/> : <Navigate replace to="/login"/>}/>
                    <Route path="/account" element={cookie.token ? <Account/> : <Navigate replace to="/login"/>}/>
                    <Route path="/login" element={<LogIn/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/home" element={cookie.token ? <Navigate replace to="/home/today"/> : <Navigate replace to="/login"/>}/>
                    <Route path="/home/:list" element={cookie.token ? <HomeProvider/> : <Navigate replace to="/login"/>}/>
                    <Route path="/home/projects/:projectId" element={cookie.token ? <HomeProvider/> : <Navigate replace to="/login"/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;