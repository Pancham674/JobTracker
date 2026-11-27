import { postJobItem, getJobItem, editJobItem } from "../services/api";
import { type IJobItem, getTodaysDate } from "../Interfaces";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type React from "react";
import "../css/NewJobItem.css";

export default function NewJobItem() {
    const [customLinks, setCustomLinks] = useState<ICustomLink[]>([createEmptyLink(1)]);
    const [jobItem, setJobItem] = useState<IJobItem>();
    const [stateStatus, setStateStatus] = useState(0);
    const [stateModel, setStateModel] = useState(0);
    
    const jobId = Number(useParams().id);
    const navi = useNavigate();
    
    useEffect(() => {
        async function loadJobItem() {
            if (jobId) {
                const grabbedItem: IJobItem = await getJobItem(jobId);
                setJobItem(grabbedItem);
                setStateModel(grabbedItem.model);
                setStateStatus(grabbedItem.status);
                setCustomLinks(Object.entries(grabbedItem.hyperlinks).map(
                    ([k, v], i) => 
                    ({   id: i,
                        title: k,
                        source: v} as ICustomLink))
                );
            }
        }
        loadJobItem();
    }, [jobId])
    
    function submitJobItem(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newItem = Object.fromEntries(formData.entries()) as unknown as IJobItem;
        const createMore = jobItem ? false : e.currentTarget["create-more"].checked;
       
        newItem.applyDeadline = newItem.applyDeadline ? newItem.applyDeadline: `0001-01-01`; 

        if (newItem.title.trim() && newItem.company.trim() && !isAnyCustomLinkEmpty(customLinks)) {
            try {
                newItem.status = Number(newItem.status);
                newItem.model = Number(newItem.model);
                newItem.travelTime = e.currentTarget["travel-time"].value;
                newItem.hyperlinks = getHyperlinks(customLinks);

                if (jobItem) {
                    newItem.id = jobId;
                    editJobItem(newItem);
                }
                else postJobItem(newItem);

                if (createMore) {       //dont leave page
                    e.currentTarget.reset();
                    e.currentTarget["create-more"].checked = true;
                    setCustomLinks([createEmptyLink(1)]);
                }
                else {                  //redirect to either details or list page 
                    if (jobItem) navi(`/${jobId}`)
                    else navi("/");
                }
            }
            catch(e) {
                console.warn(e);
            }
        }
        else {
            alert("Please make sure to add at least one link.");
        }
    }

    return (
        <form id="new-job-item" onSubmit={submitJobItem}>
            <h2>{jobItem ? `Update item #${jobId}` : "Create new item"}</h2>
            <input type="number" name="id" id="id" 
                defaultValue={jobItem ? jobItem.id : 0} hidden />
            
            <fieldset> 
                <label htmlFor="title">*Title
                    <input type="text" name="title" id="title" 
                        required defaultValue={jobItem ? jobItem.title : ""}
                        placeholder="Cashier"/>
                </label>

                <label htmlFor="company">*Company
                    <input type="text" name="company" id="company" 
                        required defaultValue={jobItem ? jobItem.company : ""}
                        placeholder="McDonald's"/>
                </label>
            </fieldset> 
            
            <fieldset> 
                <label htmlFor="applyDate">*Date you applied
                    <input type="date" name="applyDate" id="applyDate" 
                        defaultValue={jobItem ? jobItem.applyDate.toString(): getTodaysDate()}
                        required max={getTodaysDate()}/>
                </label>

                <label htmlFor="applyDeadline">Job listing deadline
                    <input type="date" name="applyDeadline" id="applyDeadline" 
                        defaultValue={jobItem ? 
                                        jobItem.applyDeadline.toString() !== "0001-01-01" ? 
                                            jobItem.applyDeadline.toString()
                                            : ""
                                        : ""} />
                </label>

                <label htmlFor="status">Current status
                    <select name="status" id="status" value={stateStatus}  onChange={(e) => setStateStatus(Number(e.currentTarget.value))}>
                        <option value={0}>Waiting</option >
                        <option value={1}>Declined</option >
                        <option value={2}>Interviewed</option >
                        <option value={3}>Offer</option >
                    </select>
                </label>
            </fieldset> 

            <fieldset> 
                <label htmlFor="model">Working model
                    <select name="model" id="model" value={stateModel}  onChange={(e) => setStateModel(Number(e.currentTarget.value))}>
                        <option value={0}>On Site</option >
                        <option value={1}>Hybrid</option >
                        <option value={2}>Full Remote</option >
                    </select>
                </label>

                <label htmlFor="location">Work location
                    <input type="text" name="location" id="location" />
                </label>

                <label htmlFor="travel-time">Travel time
                    <input type="time" id="travel-time" defaultValue="00:00" name="travel-time"/>
                </label>
            </fieldset>

            <fieldset id="links"> 
                <legend>Hyperlinks (one required)</legend>
                { customLinks.map((cl, i) => <CustomHyperlink key={i} customLink={cl}/>) }
                <button disabled={customLinks.length >= 5} 
                        onClick={() => setCustomLinks([...customLinks, createEmptyLink(customLinks.length +1)])}
                        type="button">Add more links
                </button>
                <button disabled={customLinks.length <= 1} 
                        onClick={() => setCustomLinks(customLinks.slice(0, -1))} 
                        type="button">Remove last link
                </button>
            </fieldset>

            <fieldset>
                <legend>Notes</legend>
                <textarea name="notes" id="notes" rows={10} 
                    placeholder="Info about salary, requirements, benefits, etc...."
                    defaultValue={jobItem ? jobItem.notes : ""}/>
            </fieldset>

            { !jobItem && 
            <label id="create-more">Create more
                <input type="checkbox" name="create-more" />
            </label> }

            <div id="btns">
                <button type="button" onClick={() => window.history.back()}>Cancel</button>
                <button type="submit">{jobItem ? "Update" : "Create"}</button>
            </div>
        </form>
    );
}
function createEmptyLink(myId: number): ICustomLink { 
    return {
        id: myId,
        title: "",
        source: ""
    }
};

//Returns true if any title or source from custom links array is empty
function isAnyCustomLinkEmpty(icl: ICustomLink[]) {
    return icl.find(cl => cl.title.trim() == "" || cl.source.trim() == "") != undefined;
}

function getHyperlinks(icl: ICustomLink[]) {
    const result: Record<string, string> = {};
    icl.forEach(cl => result[cl.title] = cl.source);
    return result;
}

function updateLinkValues(customLink: ICustomLink, newValue: string, attrToChange: LinkAttribute) {
    if (attrToChange === "Title") customLink.title = newValue;
    else if (attrToChange === "Source") customLink.source = newValue;
}

function CustomHyperlink ({customLink}: {customLink: ICustomLink} ) {
    return(
        <>
            <input id={`title${customLink.id}`} className="title" placeholder="Title (Company page, LinkedIn, ...)" required  
                defaultValue={customLink.title ? customLink.title : ""} onChange={(e) => updateLinkValues(customLink, e.currentTarget.value, "Title")}/>
            <input id={`value${customLink.id}`} className="value" placeholder="Actual link" required
                defaultValue={customLink.source ? customLink.source: ""} onChange={(e) => updateLinkValues(customLink, e.currentTarget.value, "Source")}/>
        </>
    );
}

interface ICustomLink {
    id: number,
    title: string,
    source: string
}

type LinkAttribute = "Title" | "Source";