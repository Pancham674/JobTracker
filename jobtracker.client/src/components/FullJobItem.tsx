import { convertToStatusString, convertToWorkingModelString, type IJobItem } from "../Interfaces.ts";
import { getJobItem } from "../services/api.ts";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/FullJobItem.css";

export default function FullJobItem() {
    const [jobItem, setJobItem] = useState<IJobItem>();
    const jobId = Number(useParams().id);

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

    return (
        jobItem ?
        <div id="full-job-item">
            <div id="header">
                <p id="title">{jobItem.title}</p>
                <p id="id">Nr. {jobItem.id}</p>
            </div>

            <div id="sub-header">
                <div className="section">
                    <p>Company: {jobItem.company}</p>
                    <p>Applied on: {new Date(jobItem.applyDate).toLocaleDateString("en-GB")}</p>
                    <p>Apply Deadline: {new Date(jobItem.applyDeadline).toLocaleDateString("en-GB")}</p>
                    <p>Status: {convertToStatusString(jobItem.status)}</p>
                </div>

                <div className="section">
                    <p>Working Model: {convertToWorkingModelString(jobItem.workingModels)}</p>
                    <p>Location: {jobItem.location}</p>
                    <p>Estimated Destination: {new Date(jobItem.estimatedDestination).toLocaleTimeString("en-GB")}</p>
                </div>
            </div>
            
            <div id="body">
                <p id="notes-header">Notes</p>
                <p id="notes">{jobItem.notes}</p>
                    <div id="hyperlinks">
                        {
                            Object.entries(jobItem.hyperlinks).map(([key, val]) => {
                                if (!val.trim()) return undefined;
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