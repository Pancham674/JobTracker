import FullJobItem from "./components/FullJobItem.tsx";
import NewJobItem from "./components/NewJobItem.tsx";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
import "./css/App.css";
import Home from "./pages/Home.tsx";

export default function App() {
    return ( 
        <div id="app">
            <Header />
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/new" element={<NewJobItem />}/>
                <Route path="/:id" element={<FullJobItem />}/>
            </Routes>
            <Footer />
        </div>
    );
}