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
      ? " text-cyan-500 hover:text-cyan-400"
      : " text-gray-500 hover:text-gray-400";
  };

  useEffect(() => {
    isSelected && setLink(text) && setSlider(navLinkRef.current);
  }, []);

  return (
    <div
      ref={navLinkRef}
      className={
        "cursor-pointer font-sans text-xl font-semibold transition-all" +
        createClassNames()
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
