import { memo, useCallback, useEffect, useRef, useState } from "react";
import NavLink from "./NavLink";
import SpringIndicator from "./SpringIndicator";

const navLinkObjects = [
  {
    text: "星图",
    href: "",
  },
  {
    text: "档案",
    href: "",
  },
  {
    text: "工具",
    href: "",
  },
];

const isColliding = (rect1: DOMRect, rect2: DOMRect) => {
  return rect1.top < rect2.bottom && rect1.bottom > rect2.top;
};

const NavBar = ({ graph }: { graph: React.RefObject<HTMLDivElement> }) => {
  const [sliderPositions, setSliderPositions] = useState({
    current: { left: 0, width: 0 },
    previous: { left: 0, width: 0 },
  });
  const navBarRef = useRef<HTMLDivElement>(null);
  const [selectedLink, setSelectedLink] = useState(navLinkObjects[0]?.text);
  const [isCollided, setIsCollided] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // if we put rectSelf and rectGraph outside of the handleScroll function,
    // the rectSelf and rectGraph will not be updated after the scroll event
    // they will only be updated when the component is mounted
    const handleScroll = () => {
      // make sure to get the newest rect after the scroll event
      const rectSelf = navBarRef.current?.getBoundingClientRect() as DOMRect;
      const rectGraph = graph.current?.getBoundingClientRect() as DOMRect;
      if (isColliding(rectSelf, rectGraph)) {
        setIsCollided(true);
      } else {
        setIsCollided(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [graph]);

  const setLinkAndSlider = useCallback(
    (text: string, navLink: HTMLDivElement) => {
      setSelectedLink(text);
      setSliderPositions((prevState) => ({
        current: {
          left: navLink.offsetLeft,
          width: navLink.offsetWidth,
        },
        previous: prevState.current,
      }));
    },
    []
  );

  const handleMenuClick = useCallback(() => {
    // using functional update to avoid stale closure
    // it is recommended to use functional update when the new state is based on the previous
    // state, especially when the update is asynchronous
    // or when updating in useEffect and useCallback
    setIsMenuOpen((prevState) => !prevState);
  }, []);

  const getNavBarClassNames = () => {
    const common =
      "transition-all duration-1000 fixed flex backdrop-blur-2xl ease-dynamicIsland dark:bg-black dark:hover:bg-black";
    return !isCollided || isMenuOpen
      ? "border-1 rounded-3xl left-0 right-0 mx-auto top-10 z-10 h-14 w-4/6 bg-white/20 " +
          common
      : "cursor-pointer place-items-center justify-center right-20 top-10 h-16 w-16 rounded-full bg-white/30 hover:bg-white/50 " +
          common;
  };

  const NavLinkItems = memo(function NavLinkItems() {
    // When NavLinkItems is memoised, there is no need to memoise NavLink (child component)
    // Memoisation of NavLinkItems will only perserve NavLinkItems when other parts of NavBar re-renders
    // but will not preserve when there's a change in NavLink (by its props)
    return (
      <div className="trans ml-10 flex h-full w-full flex-row items-center gap-12">
        {navLinkObjects.map((navLinkObject) => (
          <div key={navLinkObject.text}>
            <NavLink
              text={navLinkObject.text}
              href={navLinkObject.href}
              onLinkActive={setLinkAndSlider}
              isSelected={selectedLink === navLinkObject.text}
            />
          </div>
        ))}
        {/* because the priority of operand + is higher, remaining contents must be quoted by a bracket. */}
        <div
          className={
            "text-xl font-semibold text-white/70 hover:text-white/80 " +
            (isCollided
              ? "animate-fade-in cursor-pointer"
              : "hidden cursor-pointer")
          }
          onClick={handleMenuClick}
        >
          缩小
        </div>
      </div>
    );
  });

  return (
    <div ref={navBarRef} className={getNavBarClassNames()}>
      {!isCollided || isMenuOpen ? (
        <div>
          <NavLinkItems />
          <SpringIndicator
            fromOption={{
              left: sliderPositions.previous.left,
              width: sliderPositions.previous.width,
            }}
            toOption={{
              left: sliderPositions.current.left,
              width: sliderPositions.current.width,
            }}
            config={{ mass: 1, tension: 230, friction: 20 }}
            classNames="absolute float z-10 bottom-0 h-2 rounded-md bg-fuchsia-600 dark:bg-fuchsia-500"
          />
        </div>
      ) : (
        <span
          onClick={handleMenuClick}
          className="font-sans text-3xl font-bold text-fuchsia-600 dark:text-fuchsia-500"
        >
          ≣
        </span>
      )}
    </div>
  );
};

export default NavBar;
