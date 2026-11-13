import Interactables from "../components/Interactables.tsx";
import FullJobItem from "../components/FullJobItem.tsx";
import JobList from "../components/JobList.tsx";
import { useState } from "react";
import "../css/Home.css";

export default function Home() {
    const [jobId, setJobId] = useState(0);

    return (
        <div id="home">
            {/* <Interactables /> */}
            <JobList setJobId={setJobId}/>
            {jobId != 0 && <FullJobItem jobId={jobId}/>}
        </div>
    );
}