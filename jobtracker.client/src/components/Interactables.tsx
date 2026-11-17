import { useNavigate } from "react-router-dom";
import "../css/Interactables.css";
import { getTodaysDate } from "../Interfaces";

export default function Interactables({jobCount, handleSearchAndFilter, handleResetAll}: 
    {jobCount: number, handleSearchAndFilter: (e: React.SubmitEvent<HTMLFormElement>) => void, handleResetAll: () => void}) {
  const navi = useNavigate();

  return (
      <form id="interactables" onSubmit={handleSearchAndFilter}>
        <button id="create-new" onClick={() => navi("/new")}>
            Create new Job item
        </button>
        <h2>Application count: {jobCount}</h2>
        <input type="text" id="search-query" name="search-query" placeholder="Search by title"/> 
        <button type="submit">Search</button>
        
        <label>Page size:
            <select id="page-size" name="page-size" defaultValue={10}>
                <option>10</option>
                <option>25</option>
                <option>50</option>
            </select> 
        </label>

        <label>Status:
            <select id="status" name="status" defaultValue={["0","1","2","3"]} multiple={true}>
                <option value={0}>Waiting</option>
                <option value={1}>Declined</option>
                <option value={2}>Interview</option>
                <option value={3}>Offer</option>
            </select> 
        </label>

        <label>Start date:
            <input type="date" id="start-date" name="start-date" defaultValue={"0001-01-01"}/>
        </label>
        
        <label>End date:
            <input type="date" id="end-date" name="end-date"defaultValue={getTodaysDate()}/>
        </label>
        <button type="reset" onClick={handleResetAll}>Reset all</button>
    </form>
  );
}