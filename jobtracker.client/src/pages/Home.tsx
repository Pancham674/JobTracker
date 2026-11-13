import Interactables from "../components/Interactables.tsx";
import FullJobItem from "../components/FullJobItem.tsx";
import JobList from "../components/JobList.tsx";
import { useState } from "react";
import "../css/Home.css";

export default function Home() {
    const [jobId, setJobId] = useState(0);
    // const [jobId, setJobId] = useState(0);

    function handleJobListClick(clickedId: number) {
        if (jobId === clickedId) {
            toggleFullJobItem(2);
        } else if (jobId != clickedId) setJobId(clickedId);
    }

    function toggleFullJobItem(action: number) {
        const fullJobEl: HTMLDivElement = document.getElementById("full-job") as HTMLDivElement;
        if (!fullJobEl) return;
        
        if (action == 1) {          //hide by adding
            fullJobEl.classList.add("hide");
        } else if (action == 2) {   //show by removing
            fullJobEl.classList.remove("hide");
        }
    }   

    return (
        <div id="home">
            {/* <Interactables /> */}
            <JobList onJobListClick={handleJobListClick}/>
            {jobId != 0 && <FullJobItem currentId={jobId} toggleMe={toggleFullJobItem}/>}
        </div>
    );
}