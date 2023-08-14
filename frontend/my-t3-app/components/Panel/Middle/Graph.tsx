import { useRef } from "react";

export default function AstroGraph() {
  const graphRef = useRef<HTMLDivElement>(null);
  return (
    <div id="__graph" ref={graphRef} className="h-fit w-fit">
      <div className="h-[650px] w-[650px] rounded-full bg-graph shadow-graph transition-all motion-safe:animate-pop-up dark:bg-graphDark dark:shadow-graphDark"></div>
    </div>
  );
}
