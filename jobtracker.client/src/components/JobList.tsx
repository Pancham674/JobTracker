import { type IJobItem } from "../Interfaces.ts";
import "../css/JobList.css";

export default function JobList({ items }: {items: IJobItem[] | undefined}) {
    return (
        <div id="job-grid">
            <p>My name is job list/grid and these are my beatiful job iitems!</p>
            {items && items.map(i =>
                <div key={i.id}  className="job-item"> 
                    <p>{i.id}</p>
                    <p>{i.title}</p>
                </div>
            )}
        </div>
    );
}