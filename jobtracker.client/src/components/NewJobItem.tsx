import { useNavigate } from "react-router-dom";
import type { IJobItem } from "../Interfaces";
import { postJobItem } from "../services/api";
import type React from "react";
import "../css/NewJobItem.css";

export default function NewJobItem() {
    const navi = useNavigate();
    
    
    const date = new Date();
    const day = date.getDate().toString();
    const month = (date.getMonth()+1).toString();
    const todaysDate = `${date.getFullYear()}-${month.length == 1 ? 0 + month: month}-${day.length == 1 ? 0 + day: day}`;

    function submitJobItem(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const jobItem = Object.fromEntries(formData.entries()) as unknown as IJobItem;
        const createMore = e.currentTarget["create-more"].checked
        if (jobItem && (e.currentTarget["company-job-listing"].value.trim() 
            || e.currentTarget["company-website"].value.trim() || e.currentTarget["job-board"].value.trim())) {
            try {
                jobItem.status = Number(jobItem.status);
                jobItem.model = Number(jobItem.model);
                jobItem.hyperlinks = {
                    "Jobboard": e.currentTarget["job-board"].value,
                    "CompanyWebsite": e.currentTarget["company-website"].value,
                    "CompanyJobListing": e.currentTarget["company-job-listing"].value
                }

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
            <label htmlFor="title">*Enter the job title
                <input type="text" name="title" id="title" required />
            </label>

            <label htmlFor="company">*Enter the name of the company
                <input type="text" name="company" id="company" required />
            </label>
            
            <fieldset> 
                <legend>Dates</legend>
                <label htmlFor="applyDate">*Select the date you applied
                    <input type="date" name="applyDate" id="applyDate" defaultValue={todaysDate} required />
                </label>

                <label htmlFor="applyDeadline">Select the last day of the job listing
                    <input type="date" name="applyDeadline" id="applyDeadline" defaultValue="1990-01-01" />
                </label>
            </fieldset> 

            <label htmlFor="status">Select the current status of the application
                <select name="status" id="statue" defaultValue="Waiting">
                    <option value={0}>Waiting</option >
                    <option value={1}>Declined</option >
                    <option value={2}>Interviewed</option >
                    <option value={3}>Offer</option >
                </select>
            </label>

            <fieldset> 
                <legend>Location</legend>
                <label htmlFor="model">Select the working model
                    <select name="model" id="model" defaultValue="OnSite">
                        <option value={0}>OnSite</option >
                        <option value={1}>Hybrid</option >
                        <option value={2}>FullRemote</option >
                    </select>
                </label>

                <label htmlFor="location">Enter the working/company location
                    <input type="text" name="location" id="location" />
                </label>

                <label htmlFor="destination">Enter the destination to get to the location
                    <input type="time" id="destination" defaultValue="00:00" max="15:00" name="destination" />
                </label>
            </fieldset>

            <fieldset> 
                <legend>*Hyperlinks (one required)</legend> 
                <label htmlFor="job-board">Job board
                    <input type="text" name="job-board" id="job-board" placeholder="Indeed, StepStone, LinkedIn..." />
                </label>
                <label htmlFor="company-website">Company Website
                    <input type="text" name="company-website" id="company-website" placeholder="carrer or homepage of the company" />
                </label>
                <label htmlFor="company-job-listing">Companies Job Listing
                    <input type="text" name="company-job-listing" id="company-job-listing" placeholder="link to the direct joblisting from the company" />
                </label>
            </fieldset>

            <fieldset>
                <legend>Notes</legend>
                <textarea name="notes" id="notes" rows={10} placeholder="Info abt. salary, if you meet the requirements, thoughts abt. benefits, etc...." />
            </fieldset>

                <label>create more
                    <input type="checkbox" name="create-more"/>
                </label>
                <button type="submit">Create</button>
            <div id="submit">
            </div>
        </form>
    );
}