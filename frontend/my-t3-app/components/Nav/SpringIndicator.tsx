import { animated, useSpring } from "@react-spring/web";
import { useContext } from "react";
import { SelectedLinkContext } from ".";

const SpringIndicator = ({
  fromOption,
  toOption,
  config,
  classNames,
}: {
  fromOption: object;
  toOption: object;
  config: object;
  classNames: string;
}) => {
  const springs = useSpring({ from: fromOption, to: toOption, config: config });

  return <animated.div className={classNames} style={springs}></animated.div>;
};

export default SpringIndicator;
