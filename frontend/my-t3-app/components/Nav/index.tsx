import { createContext, useEffect, useRef, useState } from "react";
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

export const SelectedLinkContext = createContext(navLinkObjects[0]?.text);

export default function NavBar({
  graphRef,
}: {
  graphRef: React.MutableRefObject<HTMLDivElement>;
}) {
  const [sliderPosition, setSliderPosition] = useState({ left: 0, width: 0 });
  const [prevSliderPosition, setPrevSliderPosition] = useState({
    left: 0,
    width: 0,
  });
  const [selectedLink, setSelectedLink] = useState(navLinkObjects[0]?.text);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const setLink = (text: string) => {
    setSelectedLink(text);
  };

  const setSlider = (e: HTMLElement) => {
    setPrevSliderPosition({ ...sliderPosition });
    setSliderPosition({
      left: e.offsetLeft,
      width: e.offsetWidth,
    });
  };
  return (
    <div
      ref={navRef}
      className="border-1 fixed right-1/2 top-10 z-10 h-16 w-4/6 translate-x-1/2 rounded-3xl backdrop-blur-2xl"
    >
      <SelectedLinkContext.Provider value={selectedLink}>
        <SpringIndicator
          fromOption={{
            left: prevSliderPosition.left,
            width: prevSliderPosition.width,
          }}
          toOption={{
            left: sliderPosition.left,
            width: sliderPosition.width,
          }}
          config={{ mass: 1, tension: 200, friction: 20 }}
          classNames="absolute z-0 h-12 w-12 rounded-full bg-fuchsia-500/80 opacity-0 blur-xl dark:bg-fuchsia-500"
        />
        <div className="z-10 ml-10 flex h-full w-full flex-row items-center gap-12">
          {navLinkObjects.map((navLinkObject) => (
            <div key={navLinkObject.text}>
              <NavLink
                text={navLinkObject.text}
                href={navLinkObject.href}
                setLink={setLink}
                setSlider={setSlider}
              />
            </div>
          ))}
        </div>
        <SpringIndicator
          fromOption={{
            left: prevSliderPosition.left,
            width: prevSliderPosition.width,
          }}
          toOption={{
            left: sliderPosition.left,
            width: sliderPosition.width,
          }}
          config={{ mass: 1, tension: 160, friction: 20 }}
          classNames="absolute float z-10 bottom-0 h-2 rounded-md bg-fuchsia-600"
        />
      </SelectedLinkContext.Provider>
    </div>
  );
}
