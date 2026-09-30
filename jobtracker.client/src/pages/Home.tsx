import Interactables from "../components/Interactables.tsx";
import JobList from "../components/JobList.tsx";

export default function Home() {
  return (
      <div id="home">
          <Interactables />
          <JobList />
      </div>
  );
}