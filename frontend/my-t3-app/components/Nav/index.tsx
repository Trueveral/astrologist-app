import { useSpring, a, to } from "react-spring";
import { useGesture } from "react-use-gesture";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  type NavbarState,
  setNavbarCollapsed,
  setNavbarHoveredLink,
} from "@redux/navbar/navbarSlice";
import NavLink from "./Link";
import Detail, { type ColContent } from "./Detail";
import { store, type RootState } from "~/redux/store";
import { panelDetails, profileDetails } from "./fakeData";
const calcX = (y: number, ly: number) =>
  -(y - ly - window.innerHeight / 2) / 30;
const calcY = (x: number, lx: number) => (x - lx - window.innerWidth / 2) / 30;

export default function NavBar() {
  const [collided, setCollided] = useState(false);
  const domTarget = useRef(null);
  const dispatch = useDispatch();
  const navbarStates: NavbarState = useSelector(
    (state: RootState) => state.navbar
  );
  const { collapsed, hoveredLink } = navbarStates;
  const [totalHeight, setTotalHeight] = useState(0);
  const baseHeight = useRef(0);
  const [detailPage, setDetailPage] = useState<ColContent[]>([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const MAX_WIDTH = 600;

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    const handleScrollCollison = () => {
      const graph = document.getElementById("__graph") as HTMLDivElement;
      const navbar = document.getElementById("__navbar") as HTMLDivElement;
      const { top: graphTop } = graph.getBoundingClientRect();
      const { bottom: navbarBottom } = navbar.getBoundingClientRect();

      if (graphTop > navbarBottom) {
        setCollided(false);
      } else {
        setCollided(true);
      }
    };

    const handleWindowResize = () => {
      const { innerWidth } = window;
      setWindowWidth(innerWidth);
    };
    const totalHeightOfChildren = Array.from(
      (document.getElementById("__navbar") as HTMLDivElement).children
    ).reduce((prev, cur) => prev + cur.clientHeight, 0);

    setWindowWidth(window.innerWidth);
    setTotalHeight(totalHeightOfChildren);
    baseHeight.current = totalHeightOfChildren + 30;
    document.addEventListener("gesturestart", preventDefault);
    document.addEventListener("gesturechange", preventDefault);
    document.addEventListener("scroll", handleScrollCollison);
    window.addEventListener("resize", handleWindowResize);

    return () => {
      document.removeEventListener("gesturestart", preventDefault);
      document.removeEventListener("gesturechange", preventDefault);
      document.removeEventListener("scrollY", handleScrollCollison);
      window.removeEventListener("resize", handleWindowResize);
      setTotalHeight(0);
      baseHeight.current = 0;
    };
  }, []);

  useEffect(() => {
    const getDetailData = async () => {
      let d = null;
      switch (hoveredLink) {
        case "Panel":
          d = await new Promise((resolve) => {
            setTimeout(() => {
              resolve(panelDetails);
            }, 0);
          });
          return ["Panel", d];

        case "Profile":
          d = await new Promise((resolve) => {
            setTimeout(() => {
              resolve(profileDetails);
            }, 0);
          });
          return ["Profile", d];

        default:
          d = await Promise.resolve([]);
          return ["", d];
      }
    };

    getDetailData()
      .then((value: [string, ColContent[]]) => {
        if (value[0] === hoveredLink) {
          setDetailPage(value[1]);
        }
        console.log(hoveredLink);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [hoveredLink]);

  useEffect(() => {
    const totalHeightOfChildren = Array.from(
      (document.getElementById("__navbar") as HTMLDivElement).children
    ).reduce((prev, cur) => prev + cur.clientHeight, 0);

    console.log(detailPage);

    setTotalHeight(totalHeightOfChildren);
  }, [detailPage]);

  useEffect(() => {
    dispatch(setNavbarCollapsed(collided));
  }, [collided, dispatch]);

  useGesture(
    {
      onMouseDown: () =>
        apiPos.start({
          scale: 0.98,
        }),
      onMouseUp: ({ hovering }) => {
        apiPos({
          scale: hovering ? 1.08 : 1.0,
        });
      },
      onMove: ({ xy: [px, py], dragging }) =>
        !dragging &&
        apiPos.start({
          rotateX: calcX(py, y.get()) / 5,
          rotateY: calcY(px, x.get()) / 5,
          scale: 1.08,
          config: { mass: 5, tension: 350, friction: 40 },
        }),
      onHover: () => {
        if (collapsed) {
          dispatch(setNavbarCollapsed(false));
        }
      },
      onMouseLeave: () => {
        apiPos.start({
          rotateX: 0,
          rotateY: 0,
          scale: 1,
        });
        dispatch(setNavbarHoveredLink(""));
        if (collided) {
          dispatch(setNavbarCollapsed(true));
        }
      },
    },
    { domTarget, eventOptions: { passive: false } }
  );

  const { right, width, height, left } = useSpring({
    width: !collapsed
      ? windowWidth * 0.66 < MAX_WIDTH
        ? windowWidth * 0.66
        : MAX_WIDTH
      : baseHeight.current,
    height: hoveredLink === "" ? baseHeight.current : totalHeight + 30,
    from: { width: 0, height: 0, right: 0, left: 0 },
    right: collided ? (collapsed ? 40 : 0) : 0,
    left: collided
      ? collapsed
        ? windowWidth - 20 - baseHeight.current
        : 0
      : 0,
    // delay: 500,
  });

  const [{ x, y, scale }, apiPos] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    x: 0,
    y: 0,
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  return (
    <a.div
      id="__navbar"
      ref={domTarget}
      className={`fixed top-8 ml-auto mr-auto flex flex-col rounded-[40px] bg-white/40 pb-2 pl-4 pt-2 backdrop-blur-3xl dark:bg-black`}
      style={{
        transform: "perspective(600px)",
        // x,
        // y,
        left,
        right,
        width,
        height,
        scale: to([scale], (s) => s),
      }}
    >
      <div className="mt-2 flex flex-row items-center gap-4">
        {navbarStates.links.map((text, idx) => (
          <NavLink key={idx} text={text} order={idx} />
        ))}
      </div>
      <Detail content={detailPage} />
    </a.div>
  );
}
