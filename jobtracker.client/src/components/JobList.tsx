import { convertToStatusString, type IJobItem } from "../Interfaces.ts";
import { useNavigate } from "react-router-dom";
import { getAllJobItems } from "../services/api.ts";
import { useState, useEffect } from "react";
import "../css/JobList.css";

export default function JobList() {
    const [jobItems, setJobItems] = useState<IJobItem[]>([]);
    const navi = useNavigate();

    useEffect(() => {
        async function loadJobItems() {
            try {
                const items = await getAllJobItems();
                setJobItems(items);
            }
            catch (e) {
                console.warn(e);
            }
        }
        loadJobItems();
    }, []);

    return (
        <div id="job-grid">
            {jobItems && jobItems.map(i =>
                <div key={i.id}
                    className="job-item"
                    onClick={() => navi(`/${i.id}`)}>
                    <div className="job-item-header">
                        <p>{i.title}</p>
                    </div>

                    <div className="job-item-body">
                        <p>{i.company}</p>
                        <p>Status: {convertToStatusString(i.status)}</p>
                        <p>Applied on: {new Date(i.applyDate).toLocaleDateString("en-GB")}</p>
                        <p className="job-item-number">#{i.id}</p>
                    </div>
                </div>
            )}
        </div>
    );
}