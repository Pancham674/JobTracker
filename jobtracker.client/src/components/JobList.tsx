import { convertToStatusString, type IJobItem } from "../Interfaces.ts";
import "../css/JobList.css";

export default function JobList({handleJobItemClick, list}: {handleJobItemClick: (c: number) => void, list: IJobItem[]}) {
    return (
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
                    { list.map(i =>
                        <tr className="job-item" key={i.id} onClick={() => handleJobItemClick(i.id)}>
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
    );
}