import { useRef, useEffect } from "react";

const PlanetButton = ({ name }: { name: string }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
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
      <div
        ref={buttonRef}
        className="flex select-none flex-col items-center justify-center gap-1"
      >
        <button
          id={`panel-control-planet-button-${name}`}
          title={name}
          className={`h-10 w-10 flex-none cursor-pointer rounded-full border-[1px] border-gray-700 transition-[backgroundImage] motion-safe:animate-pop-up dark:border-white`}
        ></button>
        <div className="cursor-default text-center font-sans text-sm font-normal tracking-widest motion-safe:animate-fade-in dark:text-white">
          {name}
        </div>
      </div>
    </div>
  );
};

const PlanetList = ({ planets }: { planets: string[] }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains("animate-slide-in-right")
          ) {
            entry.target.classList.add("animate-slide-in-right");
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (listRef.current) {
      observer.observe(listRef.current);
    }

    return () => {
      if (listRef.current) {
        observer.unobserve(listRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={listRef}
      className="mb-8 mt-4 grid max-w-[650px] grid-cols-10 gap-y-4"
    >
      {planets.map((planet) => (
        <PlanetButton name={planet} key={planet} />
      ))}
    </div>
  );
};

export default PlanetList;
