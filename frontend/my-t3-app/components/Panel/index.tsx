import NavBar from "components/Nav";
import Left from "./Left";
import Right from "./Right";
import AstroGraph from "./Middle/Graph";
import SizeButton from "./Middle/Controls/SizeButton";
import { useRef } from "react";

const Panel = () => {
  const graphRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex min-h-[100vh] bg-panel">
      <NavBar graph={graphRef} />
      <div className="mt-32 flex h-full w-full flex-row justify-center">
        <Left />
        <div
          ref={graphRef}
          id="astroGraph"
          className="flex h-fit w-fit flex-col gap-4"
        >
          <AstroGraph />
          <div className="bottom-4 flex flex-row justify-center gap-4">
            <SizeButton graph={null} text={"+"} />
            <SizeButton graph={null} text={"—"} />
          </div>
        </div>
        <Right />
      </div>
    </div>
  );
};

export default Panel;
