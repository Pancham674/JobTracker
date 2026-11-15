import { useNavigate } from "react-router-dom";
import "../css/Interactables.css";

export default function Interactables({jobCount, handleSearch, handleResetAll}: 
    {jobCount: number, handleSearch: () => void, handleResetAll: () => void}) {
  const navi = useNavigate();

  return (
      <div id="interactables">
        <button id="create-new" onClick={() => navi("/new")}>
            Create new Job item
        </button>
        <h2>Application count: {jobCount}</h2>
        <input type="text" id="search-query" placeholder="Search by title"/> 
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleResetAll}>Reset</button>
    </div>
  );
}