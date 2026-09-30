import { useNavigate } from "react-router-dom";
export default function Interactables() {
  const navi = useNavigate();

  return (
      <div id="interactables">
        <button onClick={() => navi("/new")}>
        </button>
      </div>
  );
}