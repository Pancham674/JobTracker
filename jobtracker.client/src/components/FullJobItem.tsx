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
                const j0b = await getJobItem(jobId);
                setJobItem(j0b);
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
            <button id="delete" onClick={deleteItem}>delete</button>
            <button id="edit" onClick={() => navi(`/edit/${jobId}`)}>edit</button>
            <div id="header">
                <p id="title">{jobItem.title}</p>
                <p id="id">#{jobItem.id}</p>
            </div>

            <div id="sub-header">
                <div className="section">
                    <p>Company: {jobItem.company}</p>
                    <p>Applied on: {new Date(jobItem.applyDate).toLocaleDateString("en-GB")}</p>
                    { jobItem.applyDeadline.toString() != "1990-01-01" &&
                        <p>Apply Deadline: {new Date(jobItem.applyDeadline).toLocaleDateString("en-GB")}</p>}
                    <p>Status: {convertToStatusString(jobItem.status)}</p>
                </div>

                <div className="section">
                    <p>Working Model: {convertToWorkingModelString(jobItem.model)}</p>
                    { jobItem.location && <p>Location: {jobItem.location}</p>}
                    { jobItem.estimatedDestination && <p>Estimated Destination: {new Date(jobItem.estimatedDestination).toLocaleTimeString("en-GB")}</p>}
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

