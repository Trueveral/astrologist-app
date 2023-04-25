import SizeButton from "./Controls/SizeButton";
import AstroGraph from "./Graph";

const Middle = () => {
  return (
    <div id="astroGraph" className="flex h-fit w-fit flex-col gap-4">
      <AstroGraph />
      <div className="bottom-4 flex flex-row justify-center gap-4">
        <SizeButton graph={null} text={"+"} />
        <SizeButton graph={null} text={"—"} />
      </div>
    </div>
  );
};

export default Middle;
