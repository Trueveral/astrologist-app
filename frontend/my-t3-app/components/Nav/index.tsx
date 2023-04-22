import { createContext, useState } from "react";
import NavLink from "./NavLink";
import SpringIndicator from "./SpringIndicator";

const navLinkObjects = [
  {
    text: "星盘",
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

export default function NavBar() {
  const [sliderPosition, setSliderPosition] = useState({ left: 0, width: 0 });
  const [prevSliderPosition, setPrevSliderPosition] = useState({
    left: 0,
    width: 0,
  });
  const [selectedLink, setSelectedLink] = useState(navLinkObjects[0]?.text);

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
    <div className="border-1 relative top-5 z-10 h-16 w-4/6 overflow-hidden rounded-3xl border-[1px] border-gray-200/30 bg-white/40 shadow-2xl shadow-gray-200 backdrop-blur-2xl dark:bg-black">
      <SelectedLinkContext.Provider value={selectedLink}>
        <SpringIndicator
          fromOption={{
            left: prevSliderPosition.left,
            width: prevSliderPosition.width,
          }}
          toOption={{ left: sliderPosition.left, width: sliderPosition.width }}
          config={{ mass: 1, tension: 200, friction: 20 }}
          classNames="absolute z-0 h-12 w-12 rounded-full bg-cyan-500/30 blur-xl dark:bg-cyan-500"
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
          config={{ mass: 1, tension: 200, friction: 20 }}
          classNames="absolute float z-10 bottom-0 h-1 rounded-sm bg-cyan-500"
        />
      </SelectedLinkContext.Provider>
    </div>
  );
}
