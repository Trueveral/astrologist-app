import { animated, useSpring } from "@react-spring/web";

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
