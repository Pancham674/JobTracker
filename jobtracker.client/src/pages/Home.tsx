import { deleteJobItem, getAllJobItems, getJobItem } from "../services/api.ts";
import Interactables from "../components/Interactables.tsx";
import type { IJobItem, IPageInfo } from "../Interfaces.ts";
import FullJobItem from "../components/FullJobItem.tsx";
import JobList from "../components/JobList.tsx";
import { useEffect, useState } from "react";
import "../css/Home.css";

export default function Home() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState<IPageInfo>();
    const [jobItem, setJobItem] = useState<IJobItem>();

    const searchQueryEl = document.getElementById("search-query")! as HTMLInputElement;
    const formEl = document.getElementById("interactables") as HTMLFormElement;

    useEffect(() => {
        loadPageInfo(0);
    }, []);

    function searchByQuery() {
        const searchQuery = searchQueryEl.value;
        const lastId = pageInfo?.records[pageInfo?.records.length -1].id;
        console.log(searchQuery)
        loadPageInfo(lastId);
    }

    function onResetAll(){
        loadPageInfo(0);
    }

    async function loadPageInfo(lastId: number) {
        try {
            const data = await getAllJobItems();
            setIsPageLoading(false);
            setPageInfo(data);
            console.log("Page Info gathered");
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

            const lastId = pageInfo!.records[pageInfo!.records.length -1].id;
            loadPageInfo(lastId);
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
            <Interactables handleSearch={searchByQuery} jobCount={pageInfo ? pageInfo.records.length : 0} handleResetAll={onResetAll}/>
            { !isPageLoading ? 
                <JobList handleJobItemClick={onJobItemClick} list={pageInfo!.records}/>
                : <h2 className="loading">Reload this page once the server has started!</h2> }                
            {jobItem ? 
                <FullJobItem toggleMe={toggleFullJobItem} deleteItem={deleteItem} jobItem={jobItem}/>
                : <h2 className="loading">Click a job Item to view its details.</h2>}
        </div>
    );
}