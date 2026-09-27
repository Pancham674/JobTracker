import FullJobItem from "./components/FullJobItem.tsx";
import NewJobItem from "./components/NewJobItem.tsx";
import { Route, Routes } from "react-router-dom";
import JobList from "./components/JobList.tsx";
import "./css/App.css";

export default function App() {
    return ( 
        <div id="app">
            <h1> Yo. This is futur e turture device called: j#b trackr </h1>
            <Routes>
                <Route path="/" element={<JobList />}/>
                <Route path="/new" element={<NewJobItem />}/>
                <Route path="/:id" element={<FullJobItem />}/>
            </Routes>
        </div>
    );
}