import Interactables from "../components/Interactables.tsx";
import JobList from "../components/JobList.tsx";
import "../css/Home.css";

export default function Home() {
  return (
      <div id="home">
          <JobList />
          <Interactables />
      </div>
  );
}