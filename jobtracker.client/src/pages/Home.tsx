import type { Filters, IJobItem, IPageInfo, PageActions, ToggleActions } from "../Interfaces.ts";
import { deleteJobItem, getAllJobItems, getJobItem } from "../services/api.ts";
import Interactables from "../components/Interactables.tsx";
import FullJobItem from "../components/FullJobItem.tsx";
import PageButtons from "../components/PageButtons.tsx";
import { useEffect, useRef, useState } from "react";
import JobList from "../components/JobList.tsx";
import "../css/Home.css";

export default function Home() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState<IPageInfo>();
    const [jobItem, setJobItem] = useState<IJobItem>();
    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
    
    const pageFilters = useRef<Filters>({       //use object to save the filters and reuse them for page flipping, deleting, etc.
        startDate: undefined,
	    status:  undefined,
	    pageSize: undefined,
        lastId: undefined,
	    endDate: undefined,
	    query:  undefined
    });

    useEffect(() => {
        async function onFirstRender() {
            await sleep(1000);  //wait for server to start before fetching
            loadPageInfo(pageFilters.current);
        }
        onFirstRender();
    }, []);

    function onPageFlip(action: PageActions) {
        if (action === "Next") {    //current highest id is the anchor for the next page
            pageFilters.current.lastId = pageInfo!.matchedRecords[pageInfo!.matchedRecords.length -1].id;
            loadPageInfo(pageFilters.current);
        }
        else if (action === "Previous") {
            pageFilters.current.lastId = pageInfo!.lastIdOfPrevPage;
            loadPageInfo(pageFilters.current);
        }
    }

    function searchAndFilter(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        //grap all formdata and use it for the filter
        const formData = Object.fromEntries(new FormData(e.currentTarget).entries());
        const statArr = Array.from((e.currentTarget["status"] as HTMLSelectElement).selectedOptions).map(o => Number(o.value));
        const prevFilters = pageFilters.current;
        
        pageFilters.current = {
            startDate: formData["start-date"].toString(),
	        status:  statArr,
	        pageSize: Number(formData["page-size"]),
            lastId: undefined,
	        endDate: formData["end-date"].toString(),
	        query:  formData["search-query"].toString()
        };

        //if nothing changed then do nothing
        if (JSON.stringify(prevFilters) !== JSON.stringify(pageFilters.current)) loadPageInfo(pageFilters.current);
    }

    function onResetAll(){
        pageFilters.current = {
            startDate: undefined,
	        status:  undefined,
	        pageSize: undefined,
            lastId: undefined,
	        endDate: undefined,
	        query:  undefined
        };
        loadPageInfo(pageFilters.current);
    }

    async function loadPageInfo(pageFilters: Filters) {
        try {
            const data = await getAllJobItems(pageFilters);
            setIsPageLoading(false);
            toggleFullJobItem("Hide");
            setPageInfo(data);
            console.log("Page Info gathered");
        }
        catch (e) {
            console.warn(e);
        }
    }

    async function onJobItemClick(clickedId: number) {
        if (jobItem?.id === clickedId) toggleFullJobItem("Show");
        else if (jobItem?.id != clickedId) {
            try {
                setJobItem(await getJobItem(clickedId));
            } catch (e) { console.warn(e); }

            toggleFullJobItem("Show")
        }
    }

    async function deleteItem() {
        try {
            toggleFullJobItem("Hide");
            await deleteJobItem(jobItem!.id);

            //since we stay on the same page, the items after this id will go up by one
            pageFilters.current.lastId = pageInfo!.matchedRecords[0].id -1; 
            loadPageInfo(pageFilters.current);
        }
        catch (e) {
            console.warn(e)
        }
    }

    function toggleFullJobItem(action: ToggleActions) {
        const fullJobEl: HTMLDivElement = document.getElementById("full-job") as HTMLDivElement;
        if (!fullJobEl) return;
        fullJobEl.hidden = action == "Hide";
    }   

    return (
        <div id="home">
            <Interactables handleSearchAndFilter={searchAndFilter} jobCount={pageInfo ? pageInfo.allRecordsCount : 0} handleResetAll={onResetAll} />
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