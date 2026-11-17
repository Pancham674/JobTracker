import { type PageActions } from "../Interfaces.ts";
export default function PageButtons({hasNextPage, hasPrevPage, handlePageFlip}: {hasNextPage: boolean, hasPrevPage: boolean, handlePageFlip: (e: PageActions) => void}) {
  return (
      <div id="page-btns">
          <button onClick={() => handlePageFlip("Previous")} disabled={!hasPrevPage}>Prev</button>
          <button onClick={() => handlePageFlip("Next")} disabled={!hasNextPage}>Next</button>
      </div>
  );
}