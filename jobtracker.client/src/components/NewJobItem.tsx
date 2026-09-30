import { useNavigate } from "react-router-dom";
import type { IJobItem } from "../Interfaces";
import { postJobItem } from "../services/api";
import type React from "react";

export default function NewJobItem() {
    const navi = useNavigate();
    
    function submitJobItem(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const jobItem: IJobItem = Object.fromEntries(formData.entries()) as unknown as IJobItem;
        const createMore = e.currentTarget["create-more"].checked
        if (jobItem && e.currentTarget["company-job-listing"].trim() 
            && e.currentTarget["company-website"].trim() && e.currentTarget["job-board"].trim()) {
            try {
                jobItem.status = Number(jobItem.status);
                jobItem.workingModels = Number(jobItem.workingModels);
                postJobItem(jobItem);

                if (!createMore) {
                    navi("/");
                }
                else {
                    e.currentTarget.reset();
                }
            }
            catch(e) {
                console.warn(e)
                console.log("FUCK")
            }
        }
        else {
            alert("Please make sure to add at least one link.");
        }
    }

    return (
        <form id="new-job-item" onSubmit={submitJobItem}>
            <input type="number" name="id" id="id" defaultValue={0} hidden />
            <input type="text" name="title" id="title" placeholder="Enter job title" required />

            <input type="text" name="company" id="company" placeholder="Enter company" required />
            <input type="date" name="applyDate" id="applyDate" placeholder="Enter when you applied" required />
            <input type="date" name="applyDeadline" id="applyDeadline" placeholder="Enter the deadline is (opt.)" />
            
            <select name="status" defaultValue="Waiting">
                <option value={0}>Waiting</option >
                <option value={1}>Declined</option >
                <option value={2}>Interviewed</option >
                <option value={3}>Offer</option >
            </select>

            <select name="workingModel" defaultValue="OnSite">
                <option value={0}>OnSite</option >
                <option value={1}>Hybrid</option >
                <option value={2}>FullRemote</option >
            </select>
            
            <input type="text" name="location" id="location" placeholder="Enter the working/company location (opt.)" />
            <input type="time" name="destination" id="destination" placeholder="Enter the destination to get to the location (opt.)" />
            
            <input type="text" name="notes" id="notes" placeholder="Enter your notes here (opt.)" />
            <fieldset> 
                <legend> Hyperlinks (one required)</legend> 
                <label>Job board
                    <input id="company-job-listing" type="text" name="job-board" placeholder="Indeed, StepStone, LinkedIn..." />
                </label>
                <label>Company Website
                    <input type="text" name="company-website" placeholder="carrer or homepage of the company" />
                </label>
                <label>Companies Job Listing
                    <input type="text" name="company-job-listing" placeholder="link to the direct joblisting from the company" />
                </label>
            </fieldset>

            <label htmlFor="create-more">create more</label>
            <input type="checkbox" name="create-more"/>
            <button type="submit">Create</button>
        </form>
    );
}