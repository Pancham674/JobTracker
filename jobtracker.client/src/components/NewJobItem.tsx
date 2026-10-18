import { postJobItem, getJobItem, editJobItem } from "../services/api";
import { convertToStatusString, type IJobItem } from "../Interfaces";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type React from "react";
import "../css/NewJobItem.css";

export default function NewJobItem() {
    const [jobItem, setJobItem] = useState<IJobItem>();
    const jobId = Number(useParams().id);
    const navi = useNavigate();
    
    const date = new Date();
    const day = date.getDate().toString();
    const month = (date.getMonth() +1).toString();
    const todaysDate = `${date.getFullYear()}-${month.length == 1 ? 0 + month: month}-${day.length == 1 ? 0 + day: day}`;

    useEffect(() => {
        async function loadJobItem() {
            if (jobId) {
                setJobItem(await getJobItem(jobId));
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

        if (newItem && (e.currentTarget["company-job-listing"].value.trim() 
            || e.currentTarget["company-website"].value.trim() || e.currentTarget["job-board"].value.trim())) {
            try {
                newItem.status = Number(newItem.status);
                newItem.model = Number(newItem.model);
                newItem.hyperlinks = {
                    "Jobboard": e.currentTarget["job-board"].value,
                    "CompanyWebsite": e.currentTarget["company-website"].value,
                    "CompanyJobListing": e.currentTarget["company-job-listing"].value
                }
                newItem.travelTime = e.currentTarget["travel-time"].value;

                if (jobItem) {
                    newItem.id = jobId;
                    editJobItem(newItem);
                }
                else postJobItem(newItem);

                if (createMore) {       //dont leave page
                    e.currentTarget.reset();
                    e.currentTarget["create-more"].checked = true;
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
                        defaultValue={jobItem ? jobItem.applyDate.toString(): todaysDate}
                        required max={todaysDate}/>
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
                    <select name="status" id="status" defaultValue={jobItem ? convertToStatusString(jobItem.status) : "Waiting"}>
                        <option value={0}>Waiting</option >
                        <option value={1}>Declined</option >
                        <option value={2}>Interviewed</option >
                        <option value={3}>Offer</option >
                    </select>
                </label>
            </fieldset> 

            <fieldset> 
                <label htmlFor="model">Working model
                    <select name="model" id="model" defaultValue="OnSite">
                        <option value={0}>OnSite</option >
                        <option value={1}>Hybrid</option >
                        <option value={2}>FullRemote</option >
                    </select>
                </label>

                <label htmlFor="location">Work location
                    <input type="text" name="location" id="location" />
                </label>

                <label htmlFor="travel-time">Travel time
                    <input type="time" id="travel-time" defaultValue="00:00" name="travel-time"/>
                </label>
            </fieldset>

            <fieldset> 
                <legend>Hyperlinks (one required)</legend> 
                <label htmlFor="job-board">Job board
                    <input type="text" name="job-board" id="job-board" 
                        placeholder="Indeed, StepStone, LinkedIn..."  defaultValue={jobItem ? jobItem.hyperlinks.Jobboard : ""}/>
                </label>
                <label htmlFor="company-website">Company Website
                    <input type="text" name="company-website" id="company-website" 
                        placeholder="Carrer or Homepage" defaultValue={jobItem ? jobItem.hyperlinks.CompanyWebsite : ""}/>
                </label>
                <label htmlFor="company-job-listing">Companies Job Listing
                    <input type="text" name="company-job-listing" id="company-job-listing" 
                        placeholder="Direct link to job" defaultValue={jobItem ? jobItem.hyperlinks.CompanyJobListing : ""}/>
                </label>
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