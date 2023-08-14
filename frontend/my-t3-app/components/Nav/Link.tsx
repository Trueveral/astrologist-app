import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSpring, a, easings, useTransition } from "react-spring";
import { useGesture } from "react-use-gesture";
import {
  setNavbarSelectedLink,
  type NavbarState,
  setNavbarHoveredLink,
  setNavbarSelectedLinkRect,
} from "@redux/navbar/navbarSlice";
import { type RootState } from "~/redux/store";

const NavLink = ({ text, order }: { text: string; order: number }) => {
  const navbarStates: NavbarState = useSelector(
    (state: RootState) => state.navbar
  );
  const dispatch = useDispatch();
  const { collapsed, hoveredLink, selectedLink } = navbarStates;
  const domTarget = useRef(null);

  const { opacity, filter } = useSpring({
    // height: collapsed ? 0 : 30,
    // width: collapsed ? 0 : 50,
    opacity: collapsed
      ? 0
      : text === hoveredLink || text === selectedLink
      ? 0.7
      : 1,
    // blur effect
    filter: collapsed ? "blur(20px)" : "blur(0px)",
    from: { opacity: 0, filter: "blur(20px)" },
    config: { easing: easings.easeInOutSine },
    delay: collapsed ? (order + 1) * 10 : (order + 1) * 50,
  });

  useGesture(
    {
      onClick: () => {
        dispatch(setNavbarSelectedLink(text));
        dispatch(
          setNavbarSelectedLinkRect(
            (domTarget.current as HTMLElement).getBoundingClientRect()
          )
        );
      },
      onMouseEnter: () => {
        dispatch(setNavbarHoveredLink(text));
      },
    },
    { domTarget }
  );

  return (
    <a.div
      className="flex items-center justify-center"
      ref={domTarget}
      style={{ opacity, filter }}
    >
      <div className="cursor-pointer font-sans text-lg font-medium text-gray-500 dark:text-gray-100">
        {text}
      </div>
    </a.div>
  );
};

export default NavLink;
