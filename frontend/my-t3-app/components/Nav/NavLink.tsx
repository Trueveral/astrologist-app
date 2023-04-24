import Link from "next/link";
import { useRef, useEffect, useState, useContext } from "react";
import { SelectedLinkContext } from ".";

// 从 props 中解构出 text, href, handleSelect
// 原先的写法是 const NavLink = (props) => {text, href, handleSelect} = props

const NavLink = ({
  text,
  href,
  setLink,
  setSlider,
}: {
  text: string;
  href: string;
  setLink: (text: string) => void;
  setSlider: (e: HTMLElement) => void;
}) => {
  const navLinkRef = useRef<HTMLElement | null>(null);
  const selectedLink = useContext(SelectedLinkContext);
  const isSelected = text === selectedLink;

  // TODO: use when other pages are added
  // if (window.location.href === `http://localhost:3000${href}`) {
  //   setIsSelected(true);
  // }
  const createClassNames = () => {
    return isSelected
      ? " text-fuchsia-600 hover:text-fuchsia-500 dark:text-fuchsia-400 dark:hover:text-fuchsia-300 transition-all"
      : " text-gray-600 hover:text-gray-500 dark:text-white/50 hover:dark:text-white/70 transition-all";
  };

  useEffect(() => {
    isSelected && setLink(text) && setSlider(navLinkRef.current);
  }, []);

  return (
    <div
      ref={navLinkRef}
      className={
        "cursor-pointer font-sans text-xl font-semibold" + createClassNames()
      }
    >
      <Link
        href={href}
        onClick={() => {
          setLink(text);
          setSlider(navLinkRef.current);
        }}
      >
        {text}
      </Link>
    </div>
  );
};

export default NavLink;
