import NavBar from "components/Nav";
import Left from "./Left";
import Right from "./Right";
import { useRef } from "react";
import Middle from "./Middle";

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
          <Middle />
        </div>
        <Right />
      </div>
    </div>
  );
};

export default Panel;
