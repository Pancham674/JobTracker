import { convertToLinkTypeString, convertToStatusString, convertToWorkingModelString, type IJobItem, type ToggleActions } from "../Interfaces.ts";
import { useNavigate } from "react-router-dom";
import "../css/FullJobItem.css";

export default function FullJobItem({toggleMe, deleteItem, jobItem}: {toggleMe: (a: ToggleActions) => void, deleteItem: () => void, jobItem: IJobItem}) {
    const navi = useNavigate();

    return (
        <div id="full-job">
            <div id="btns">
                <button onClick={() => toggleMe("Hide")}>Close</button>
                <button id="edit" onClick={() => navi(`/edit/${jobItem.id}`)}>Edit</button>
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
    );
}

function ToHourMinString(travelTime: string):string {
    const times = travelTime.split(":");
    return `${times[0]}H ${times[1]}M`
}