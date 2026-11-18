import { useNavigate } from "react-router-dom";
import { getTodaysDate } from "../Interfaces";
import { useState } from "react";

import "../css/Interactables.css";

export default function Interactables({jobCount, handleSearchAndFilter, handleResetAll}: 
    {jobCount: number, handleSearchAndFilter: (e: React.SubmitEvent<HTMLFormElement>) => void, handleResetAll: () => void}) {
  const [isFilterHidden, setIsFilterHidden] = useState(true);
  const navi = useNavigate();

  return (
      <form id="interactables" onSubmit={handleSearchAndFilter}>
        <h2 id="app-count">Application count: {jobCount}</h2>

        <div id="top-part">
            <button type="button" id="create-new" onClick={() => navi("/new")}>
                Create new Job item
            </button>
            <input type="text" id="search-query" name="search-query" placeholder="Search by title or company"/> 
            <button type="submit">Search</button>
            <button id="toggle-filter" type="button" onClick={() => setIsFilterHidden(isHidden => !isHidden)}>{`${isFilterHidden ? "Show" : "Hide"}`} filters</button>
        </div>

        <div id="bottom-part" hidden={isFilterHidden}>
            <label>Status
                <select id="status" name="status" defaultValue={["0","1","2","3"]} multiple={true}>
                    <option value={0}>Waiting</option>
                    <option value={1}>Declined</option>
                    <option value={2}>Interview</option>
                    <option value={3}>Offer</option>
                </select> 
            </label>

            <div id="dates">
                <label>Start date
                    <input type="date" id="start-date" name="start-date" defaultValue={"0001-01-01"}/>
                </label>
        
                <label>End date
                    <input type="date" id="end-date" name="end-date"defaultValue={getTodaysDate()}/>
                </label>
            </div>
            <div id="page-reset">
                <label>Page size
                    <select id="page-size" name="page-size" defaultValue={10}>
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select> 
                </label>

                <button id="reset-btn" type="reset" onClick={handleResetAll}>Reset all</button>
            </div>
        </div>
    </form>
  );
}