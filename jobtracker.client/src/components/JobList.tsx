import { convertToStatusString, type IJobItem } from "../Interfaces.ts";
import "../css/JobList.css";

export default function JobList({handleJobListClick, list, isLoading}: {handleJobListClick: (c: number) => void, list: IJobItem[], isLoading: boolean}) {
    return (
        !isLoading ?
        <>
            <h2>Application count: {list.length}</h2>
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
                            <tr className="job-item" key={i.id} onClick={() => handleJobListClick(i.id)}>
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
        </>
        : <h2 className="loading">Reload this page once the server has started!</h2>
    );
}