import { convertToStatusString, convertToWorkingModelString, type IJobItem } from "../Interfaces.ts";
import { getJobItem, deleteJobItem } from "../services/api.ts";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/FullJobItem.css";

export default function FullJobItem() {
    const [jobItem, setJobItem] = useState<IJobItem>();
    const jobId = Number(useParams().id);
    const navi = useNavigate();

    useEffect(() => {
        async function loadJobItem() {
            try {
                setJobItem(await getJobItem(jobId));
            }
            catch (e) {
                console.warn(e);
            }
        }
        loadJobItem();
    }, [jobId]);

    async function deleteItem() {
        try {
            await deleteJobItem(jobId);
            navi("/");
        }
        catch (e) {
            console.warn(e)
        }
    }

    return (
        jobItem ?
        <div id="full-job-item">
            <div id="btns">
                <button onClick={() => window.history.back()}>Go back</button>
                <button id="edit" onClick={() => navi(`/edit/${jobId}`)}>edit</button>
                <button id="delete" onClick={deleteItem}>delete</button>
            </div>
            
            <div id="header">
                <p id="title">{jobItem.title}</p>
                <p id="id">#{jobItem.id}</p>
            </div>

            <div id="sub-header">
                <div className="section">
                    <p>Company: {jobItem.company}</p>
                    <p>Applied on: {new Date(jobItem.applyDate).toLocaleDateString("en-GB")}</p>
                    { jobItem.applyDeadline.toString() != `0001-01-01` &&
                        <p>Apply Deadline: {new Date(jobItem.applyDeadline).toLocaleDateString("en-GB")}</p>}
                    <p>Status: {convertToStatusString(jobItem.status)}</p>
                </div>

                <div className="section">
                    <p>Working Model: {convertToWorkingModelString(jobItem.model)}</p>
                    { jobItem.location && <p>Location: {jobItem.location}</p>}
                    { (jobItem.travelTime && jobItem.travelTime.toString() != "00:00:00") && <p>Travel time: {ToHourMinString(jobItem.travelTime.toString())}</p>}
                </div>
            </div>
            
            <div id="body">
                { jobItem.notes.trim() && 
                    <>
                        <p id="notes-header">Notes:</p>
                        <p id="notes">{jobItem.notes}</p>
                    </>
                }
                    <div id="hyperlinks">
                        {
                            Object.entries(jobItem.hyperlinks).map(([key, val]) => {
                                if (!val.trim()) return;
                                return (
                                    <a key={key}
                                        href={val}
                                        target="_blank">
                                        {key}
                                    </a>
                                );
                            })
                        }
                    </div>
            </div>
        </div>
        : <h2 className="loading">Loading JobItem id {jobId}!</h2>
    );
}

function ToHourMinString(travelTime: string):string {
    const times = travelTime.split(":");
    return `${times[0]}H ${times[1]}M`
}