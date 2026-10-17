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
        <div id="table-container">
            <table>
                <thead>
                    <tr>
                        <th id="id">ID</th>
                        <th id="title">Title</th>
                        <th id="company">Company</th>
                        <th id="status">Status</th>
                        <th id="apply-date">Applied on</th>
                    </tr>
                </thead>
                <tbody>
                    { jobItems.map(i =>
                        <tr className="job-item" key={i.id} onClick={() => navi(`/${i.id}`)}>
                            <td className="id">{i.id}</td>
                            <td className="header">{i.title}</td>

                            <td>{i.company}</td>
                            <td>{convertToStatusString(i.status)}</td>
                            <td>{new Date(i.applyDate).toLocaleDateString("en-GB")}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        : <h2 className="loading">Reload this page once the server has started!</h2>
    );
}