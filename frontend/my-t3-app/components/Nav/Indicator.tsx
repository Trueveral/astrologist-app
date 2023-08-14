import { useSpring, a } from "react-spring";

const Indicator = ({
  rectLeft,
  rectY,
  rectWidth,
}: {
  rectLeft: number;
  rectY: number;
  rectWidth: number;
}) => {
  const { left, y, width } = useSpring({
    left: rectLeft,
    y: rectY,
    width: rectWidth,
    from: { left: 0, width: 0, y: rectY },
  });

  return (
    <a.div
      className="fixed h-2 rounded-full bg-fuchsia-500"
      style={{ left, y, width }}
    ></a.div>
  );
};

export default Indicator;
