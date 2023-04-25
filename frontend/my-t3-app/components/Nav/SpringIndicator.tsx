import { animated, useSpring } from "@react-spring/web";
import { memo } from "react";

const SpringIndicator = memo(function SpringIndicator({
  fromOption,
  toOption,
  config,
  classNames,
  onAnimationComplete,
  reset,
}: {
  fromOption: object;
  toOption: object;
  config: object;
  classNames: string;
  onAnimationComplete?: () => void;
  reset?: boolean;
}) {
  const springs = useSpring({
    from: fromOption,
    to: toOption,
    config: config,
    onRest: onAnimationComplete,
    reset: reset,
  });

  return <animated.div className={classNames} style={springs}></animated.div>;
});

export default SpringIndicator;
