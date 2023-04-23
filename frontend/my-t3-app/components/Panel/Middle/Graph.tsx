import { useRef } from "react";

export default function AstroGraph({
  ref,
}: {
  ref: React.MutableRefObject<HTMLDivElement>;
}) {
  const graphRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={graphRef} className="h-fit w-fit">
      <div className="h-[650px] w-[650px] rounded-full bg-graph shadow-graph transition-all"></div>
    </div>
  );
}
