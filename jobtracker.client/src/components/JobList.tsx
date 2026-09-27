import { convertToStatusString, type IJobItem } from "../Interfaces.ts";
import "../css/JobList.css";

export default function JobList({ items }: {items: IJobItem[]}) {
    return (
        <div id="job-grid">
            {items && items.map(i =>
                <div key={i.id}  className="job-item"> 
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