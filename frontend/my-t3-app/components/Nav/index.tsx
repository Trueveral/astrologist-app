import { useCallback, useEffect, useRef, useState } from "react";
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

const detectCollision = (rect1: DOMRect, rect2: DOMRect) => {
  return rect1.top < rect2.bottom && rect1.bottom > rect2.top;
};

// ! DO NOT DEFINE COMPONENTS INSIDE OTHER COMPONENTS
const CollapseButton = ({
  isCollided,
  onClick,
}: {
  isCollided: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={
        "text-xl font-semibold text-white/70 hover:text-white/80 " +
        (isCollided ? "animate-fade-in cursor-pointer" : "hidden")
      }
      onClick={onClick}
    >
      缩小
    </div>
  );
};

// ! TO AVOID RE-RENDER, SEPARATE THIS COMPONENT FROM NavBar
// ! THIS IS A GOOD PRACTICE
const NavLinkItems = ({
  isCollided,
  selectedLink,
  handleMenuClick,
  setLinkAndSlider,
}: {
  isCollided: boolean;
  selectedLink: string;
  handleMenuClick: () => void;
  setLinkAndSlider: (text: string, navLink: HTMLDivElement) => void;
}) => (
  /* When NavLinkItems is memoised, there is no need to memoise NavLink (child component)*/ /* Memoisation of NavLinkItems will only perserve NavLinkItems when other parts of NavBar re-renders*/ /* but will not preserve when there's a change in NavLink (by its props)\*/ <div className="trans z-10 ml-10 flex h-full w-full flex-row items-center gap-12">
    {navLinkObjects.map((navLinkObject) => (
      <div key={navLinkObject.text}>
        <NavLink
          text={navLinkObject.text}
          href={navLinkObject.href}
          onLinkActive={setLinkAndSlider}
          isActive={selectedLink === navLinkObject.text}
        />
      </div>
    ))}
    {/* because the priority of operand + is higher, remaining contents must be quoted by a bracket. */}
    <CollapseButton isCollided={isCollided} onClick={handleMenuClick} />
  </div>
);

const NavBar = ({ graph }: { graph: React.RefObject<HTMLDivElement> }) => {
  const [sliderPositions, setSliderPositions] = useState({
    current: { left: 0, width: 0 },
    previous: { left: 0, width: 0 },
  });

  const navBarRef = useRef<HTMLDivElement>(null);
  const [selectedLink, setSelectedLink] = useState(navLinkObjects[0]?.text);
  const [linkClicked, setLinkClicked] = useState(false);
  const [isCollided, setIsCollided] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const initialValuesRef = useRef({
    selectedLink: navLinkObjects[0]?.text,
    linkClicked: false,
    isCollided: false,
    isMenuOpen: false,
  });

  useEffect(() => {
    // if we put rectSelf and rectGraph outside of the handleScroll function,
    // the rectSelf and rectGraph will not be updated after the scroll event
    // they will only be updated when the component is mounted
    const handleScroll = () => {
      // make sure to get the newest rect after the scroll event
      const rectSelf = navBarRef.current?.getBoundingClientRect() as DOMRect;
      const rectGraph = graph.current?.getBoundingClientRect() as DOMRect;
      if (detectCollision(rectSelf, rectGraph)) {
        setIsCollided(true);
      } else {
        setIsCollided(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [graph]);

  useEffect(() => {
    const { linkClicked: initialLinkClicked } = initialValuesRef.current;
    if (linkClicked !== initialLinkClicked) {
      navBarRef.current?.classList.add("shadow-navBar");
      navBarRef.current?.classList.add("dark:shadow-navBarDark");
      setTimeout(() => {
        navBarRef.current?.classList.remove("shadow-navBar");
        navBarRef.current?.classList.remove("dark:shadow-navBarDark");
      }, 200);
      setLinkClicked(false);
    }
  }, [linkClicked, isMenuOpen]);

  const handleMouseDown = useCallback(() => {
    navBarRef.current?.classList.add("scale-[0.99]");
  }, []);

  const handleMouseUp = useCallback(() => {
    navBarRef.current?.classList.remove("scale-[0.99]");
  }, []);

  const setLinkAndSlider = useCallback(
    (text: string, navLink: HTMLDivElement) => {
      setLinkClicked(true);
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

  const getNavBarClassNames = useCallback(() => {
    const common =
      "transition-all rounded-full duration-1000 fixed flex backdrop-blur-2xl z-0 ease-dynamicIsland dark:bg-black dark:hover:bg-black overflow-hidden ";
    return !isCollided || isMenuOpen
      ? "border-1 left-0 right-0 mx-auto top-10 animate-dynamic-grow bg-white/20 " +
          common
      : "cursor-pointer place-items-center justify-center right-20 top-10 animate-dynamic-shrink bg-white/30 hover:bg-white/50 " +
          common;
  }, [isCollided, isMenuOpen]);

  return (
    <div
      ref={navBarRef}
      className={getNavBarClassNames()}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      {!isCollided || isMenuOpen ? (
        <div>
          <NavLinkItems
            isCollided={isCollided}
            selectedLink={selectedLink as string}
            setLinkAndSlider={setLinkAndSlider}
            handleMenuClick={handleMenuClick}
          />
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
            classNames="absolute float z-10 bottom-0 h-2 rounded-md bg-fuchsia-600 dark:bg-fuchsia-400"
          />
        </div>
      ) : (
        <span
          onClick={handleMenuClick}
          className="flex h-full w-full shrink-0 animate-fade-in items-center justify-center  font-sans text-3xl font-bold text-fuchsia-600 dark:text-fuchsia-500"
        >
          ≣
        </span>
      )}
    </div>
  );
};

export default NavBar;
