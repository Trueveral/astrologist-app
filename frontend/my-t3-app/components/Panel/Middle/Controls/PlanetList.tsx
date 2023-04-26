import { useRef, useEffect } from "react";

const PlanetButton = ({ name }: { name: string }) => {
  const selfRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      const element = document.getElementById(
        `panel-control-planet-button-${name}`
      );

      if (element) {
        element.classList.add("animate-pop-out");
        // 为动画完成设置一个延迟
        timerRef.current = setTimeout(() => {
          element.classList.remove("animate-pop-out");
        }, 500);
      }
    };
  }, []);

  // 清除计时器以防止内存泄漏
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="mt-2 snap-center">
      <div className="flex select-none flex-col items-center justify-center gap-1">
        <button
          id={`panel-control-planet-button-${name}`}
          title={name}
          ref={selfRef}
          className={`h-10 w-10 flex-none cursor-pointer rounded-full bg-panel transition-all hover:scale-105 motion-safe:animate-pop-up`}
        ></button>
        <div className="cursor-default text-center font-sans text-sm motion-safe:animate-fade-in">
          {name}
        </div>
      </div>
    </div>
  );
};

const PlanetList = ({ planets }: { planets: string[] }) => {
  return (
    <div className="grid max-w-[650px] grid-cols-10 gap-y-4">
      {planets.map((planet) => (
        <PlanetButton name={planet} key={planet} />
      ))}
    </div>
  );
};

export default PlanetList;
