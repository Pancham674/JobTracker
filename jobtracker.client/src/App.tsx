import { getAllJobItems } from "./services/api.ts";
import { type IJobItem } from "./Interfaces.ts";
import JobList from "./components/JobList.tsx";
import { useEffect, useState } from "react";
import "./components/NewJobItem.tsx";
import "./components/JobList.tsx";
import "./css/App.css";
export default function App() {
    const [jobItems, setJobItems] = useState<IJobItem[]>([]);

    useEffect(() => {
        async function loadJobItems() {
            const items = await getAllJobItems();
            setJobItems(items);
        }
        loadJobItems();
    }, []);

    return ( 
        <div id="app">
            <h1> Yo. This is futur e turture device called: j#b trackr </h1>
            <JobList items={jobItems} />
        </div>
    );
}