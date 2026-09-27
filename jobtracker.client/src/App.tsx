import FullJobItem from "./components/FullJobItem.tsx";
import NewJobItem from "./components/NewJobItem.tsx";
import { Route, Routes } from "react-router-dom";
import JobList from "./components/JobList.tsx";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
import "./css/App.css";

export default function App() {
    return ( 
        <div id="app">
            <Header />
            <Routes>
                <Route path="/" element={<JobList />}/>
                <Route path="/new" element={<NewJobItem />}/>
                <Route path="/:id" element={<FullJobItem />}/>
            </Routes>
            <Footer />
        </div>
    );
}