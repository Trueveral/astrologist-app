import NavBar from "components/Nav";
import Left from "./Left";
import Right from "./Right";
import Middle from "./Middle";
import { useRef } from "react";

const Panel = () => {
  const graphRef = useRef<HTMLElement>(null);
  return (
    <div className="min-h-screen bg-panel">
      <NavBar graphRef={graphRef} />
      <div className="absolute top-32 flex w-full flex-row justify-center">
        <Left />
        <Middle />
        <Right />
      </div>
    </div>
  );
};

export default Panel;
