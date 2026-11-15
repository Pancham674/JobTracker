import { deleteJobItem, getAllJobItems, getJobItem } from "../services/api.ts";
import Interactables from "../components/Interactables.tsx";
import FullJobItem from "../components/FullJobItem.tsx";
import type { IJobItem } from "../Interfaces.ts";
import JobList from "../components/JobList.tsx";
import { useEffect, useState } from "react";
import "../css/Home.css";

export default function Home() {
    const [isJobListLoading, setIsJobListLoading] = useState(true);
    const [jobItems, setJobItems] = useState<IJobItem[]>([]);
    const [jobItem, setJobItem] = useState<IJobItem>();

    const searchQueryEl = document.getElementById("search-query")! as HTMLInputElement;
    
    useEffect(() => {
        loadJobItems();
    }, []);

    function searchByQuery() {
        const searchQuery = searchQueryEl.value;
        console.log(searchQuery)
    }

    function onResetAll() {
        loadJobItems();
        searchQueryEl.value = "";

    }

    async function loadJobItems() {
        try {
            const items = await getAllJobItems();
            setIsJobListLoading(false);
            setJobItems(items);
            console.log("All Job Items received");
        }
        catch (e) {
            console.warn(e);
        }
    }

    async function onJobItemClick(clickedId: number) {
        if (jobItem?.id === clickedId) toggleFullJobItem(2);
        else if (jobItem?.id != clickedId) {
            try {
                setJobItem(await getJobItem(clickedId));
            } catch (e) { console.warn(e); }

            toggleFullJobItem(2)
        }
    }

    async function deleteItem() {
        try {
            await deleteJobItem(jobItem!.id);
            toggleFullJobItem(1);
            loadJobItems();
        }
        catch (e) {
            console.warn(e)
        }
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
            <Interactables handleSearch={searchByQuery} jobCount={jobItems.length} handleResetAll={onResetAll}/>
            { !isJobListLoading ? 
                <JobList handleJobItemClick={onJobItemClick} list={jobItems}/>
                : <h2 className="loading">Reload this page once the server has started!</h2> }                
            {jobItem ? 
                <FullJobItem toggleMe={toggleFullJobItem} deleteItem={deleteItem} jobItem={jobItem}/>
                : <h2 className="loading">Click a job Item to view its details.</h2>}
        </div>
    );
}