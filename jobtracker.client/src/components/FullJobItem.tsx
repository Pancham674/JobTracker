import { convertToStatusString, type IJobItem } from "../Interfaces.ts";
import { getJobItem } from "../services/api.ts";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
export default function FullJobItem() {
    const [jobItem, setJobItem] = useState<IJobItem>();
    const jobId = Number(useParams().id);

    useEffect(() => {
        async function loadJobItem() {
            try {
                const temp = await getJobItem(jobId);
                setJobItem(temp);
            }
            catch (e) {
                console.warn(e);
            }
        }
        loadJobItem();
    }, [jobId]);

    return (
        jobItem &&
        <div id="job-item-full">
                <p id="title">{jobItem.title}</p>
                <p>{jobItem.id}</p>
        
            <div id="job-item-full-body">
                
            </div>
        </div>
    );
}