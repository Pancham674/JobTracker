import { convertToStatusString, type IJobItem } from "../Interfaces.ts";
import { getAllJobItems } from "../services/api.ts";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/JobList.css";

export default function JobList() {
    const [jobItems, setJobItems] = useState<IJobItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navi = useNavigate();

    useEffect(() => {
        async function loadJobItems() {
            try {
                const items = await getAllJobItems();
                setJobItems(items);
                setIsLoading(false);
            }
            catch (e) {
                console.warn(e);
            }
        }
        loadJobItems();
    }, []);

    return (
        !isLoading ?
        <div id="job-grid">
            { jobItems.map(i =>
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
        : <h2 className="loading">Reload this page once the server has started!</h2>
    );
}