import { deleteJobItem, getAllJobItems, getJobItem } from "../services/api.ts";
import type { IJobItem, IPageInfo, PageActions } from "../Interfaces.ts";
import Interactables from "../components/Interactables.tsx";
import FullJobItem from "../components/FullJobItem.tsx";
import PageButtons from "../components/PageButtons.tsx";
import JobList from "../components/JobList.tsx";
import { useEffect, useState } from "react";
import "../css/Home.css";

export default function Home() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState<IPageInfo>();
    const [jobItem, setJobItem] = useState<IJobItem>();
    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
        async function onFirstRender() {
            await sleep(1000);  //wait for server to start before fetching
            loadPageInfo(undefined, undefined, undefined, undefined, undefined, undefined);
        }
        onFirstRender();
    }, []);

    function onPageFlip(action: PageActions) {
        if (action === "Next") {
            console.log("next Page");
        }
        else if (action === "Previous") {
            console.log("previous Page");
        }
    }

    //save filters in state/ref and re-use them for deleteItem and flipPage, make sure the lastId is correct
    function searchAndFilter(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formVals = Object.fromEntries(new FormData(e.currentTarget).entries());
        const statArr = Array.from((e.currentTarget["status"] as HTMLSelectElement).selectedOptions).map(o => Number(o.value));
        loadPageInfo(statArr, formVals["start-date"].toString(), formVals["end-date"].toString(),
            0, Number(formVals["page-size"]), formVals["search-query"].toString());
    }

    function onResetAll(){
        loadPageInfo(undefined, undefined, undefined, 0, 10, undefined);
    }

    async function loadPageInfo(status: number[] | undefined, startDate: string | undefined, endDate: string| undefined,
    lastId: number | undefined, pageSize: number| undefined, query: string | undefined) {
        try {
            const data = await getAllJobItems(status, startDate, endDate, lastId, pageSize, query);
            setIsPageLoading(false);
            toggleFullJobItem(1);
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
            loadPageInfo(undefined, undefined, undefined, 0, 10, undefined);
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
            <Interactables handleSearchAndFilter={searchAndFilter} jobCount={pageInfo ? pageInfo.allRecordsCount : 0} handleResetAll={onResetAll}/>
            { !isPageLoading ? 
                <>
                    <JobList handleJobItemClick={onJobItemClick} list={pageInfo!.matchedRecords}/>
                    <PageButtons hasPrevPage={pageInfo!.hasPrevPage} hasNextPage={pageInfo!.hasNextPage} handlePageFlip={onPageFlip} />
                </>
                : <h2 className="loading">Reload this page once the server has started!</h2> }                
            {jobItem ? 
                <FullJobItem toggleMe={toggleFullJobItem} deleteItem={deleteItem} jobItem={jobItem}/>
                : <h2 className="loading">Click a job Item to view its details.</h2>}
        </div>
    );
}