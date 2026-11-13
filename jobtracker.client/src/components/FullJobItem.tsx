import { convertToLinkTypeString, convertToStatusString, convertToWorkingModelString, type IJobItem } from "../Interfaces.ts";
import { getJobItem, deleteJobItem } from "../services/api.ts";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/FullJobItem.css";

export default function FullJobItem({currentId, toggleMe}: {currentId: number, toggleMe: (a: number) => void}) {
    const [jobItem, setJobItem] = useState<IJobItem>();
    const navi = useNavigate();

    useEffect(() => {
        async function loadJobItem() {
            try {
                setJobItem(await getJobItem(currentId));
                toggleMe(2);
            }
            catch (e) {
                console.warn(e);
            }
        }
        loadJobItem();
    }, [currentId]);

    async function deleteItem() {
        try {
            await deleteJobItem(currentId);
            toggleMe(1);
        }
        catch (e) {
            console.warn(e)
        }
    }

    return (
        jobItem ?
            <div id="full-job">
                <div id="btns">
                    <button onClick={() => toggleMe(1)}>Close</button>
                    <button id="edit" onClick={() => navi(`/edit/${currentId}`)}>Edit</button>
                    <button id="delete" onClick={deleteItem}>Delete</button>
                </div>
                <div id="item">
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
                 </div>
            </div>
        : <h2 className="loading">Loading JobItem id {currentId}!</h2>
    );
}

function ToHourMinString(travelTime: string):string {
    const times = travelTime.split(":");
    return `${times[0]}H ${times[1]}M`
}

