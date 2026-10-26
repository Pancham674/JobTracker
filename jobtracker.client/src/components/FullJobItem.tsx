import { convertToLinkTypeString, convertToStatusString, convertToWorkingModelString, type IJobItem } from "../Interfaces.ts";
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
            <div id="header">
                <p id="title">{jobItem.title}</p>
                <p id="id">#{jobItem.id}</p>
            </div>

            <div id="sub-header">
                <div className="section">
                    <div>
                        <p>Company:</p>
                        <p className="item-value">{jobItem.company}</p>
                    </div>
                    <div>
                        <p>Applied on:</p>
                        <p className="item-value">{new Date(jobItem.applyDate).toLocaleDateString("en-GB")}</p>
                    </div>
                    { jobItem.applyDeadline.toString() != `0001-01-01` &&
                        <div>
                            <p>Apply Deadline:</p>
                            <p className="item-value">{new Date(jobItem.applyDeadline).toLocaleDateString("en-GB")}</p>
                        </div>}
                    <div>
                        <p>Status:</p>
                        <p className="item-value">{convertToStatusString(jobItem.status)}</p>
                    </div>
                </div>

                <div className="section">
                    <div>
                        <p>Working Model:</p>
                        <p className="item-value">{convertToWorkingModelString(jobItem.model)}</p>
                    </div>
                    
                    { jobItem.location && 
                        <div>
                            <p>Location:</p>
                            <p className="item-value">{jobItem.location}</p>
                        </div>}
                    
                    { (jobItem.travelTime && jobItem.travelTime.toString() != "00:00:00") && 
                        <div>
                            <p>Travel time:</p>
                            <p className="item-value">{ToHourMinString(jobItem.travelTime.toString())}</p>
                        </div>}
                </div>
            </div>
            
            <div id="body">
                { jobItem.notes.trim() && 
                    <>
                        <p id="notes-header">Notes:</p>
                        <p id="notes" className="item-value">{jobItem.notes}</p>
                    </>
                }
                    <div id="hyperlinks">
                        {
                            Object.entries(jobItem.hyperlinks).map(([key, val], i) => {
                                if (!val.trim()) return;
                                return (
                                    <a key={key}
                                        className="item-value"
                                        href={val}
                                        target="_blank">
                                        {convertToLinkTypeString(Number(i))}
                                    </a>
                                );
                            })
                        }
                    </div>
            </div>
            <div id="btns">
                <button onClick={() => navi("/")}>Back to list</button>
                <button id="edit" onClick={() => navi(`/edit/${jobId}`)}>Edit</button>
                <button id="delete" onClick={deleteItem}>Delete</button>
            </div>
        </div>
        : <h2 className="loading">Loading JobItem id {jobId}!</h2>
    );
}

function ToHourMinString(travelTime: string):string {
    const times = travelTime.split(":");
    return `${times[0]}H ${times[1]}M`
}