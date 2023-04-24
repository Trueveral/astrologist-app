import Link from "next/link";
import { useRef, useState } from "react";

// 从 props 中解构出 text, href, handleSelect
// 原先的写法是 const NavLink = (props) => {text, href, handleSelect} = props

/**
 * Wrap a component in memo to get a memoized version of that component.
 * This memoized version of your component will usually not be re-rendered
 * when its parent component is re-rendered as long as its props have not changed.
 * But React may still re-render it: memoization is a performance optimization, not a guarantee.
 */

/**
 * A React component should always have pure rendering logic.
 * This means that it must return the same output if its props, state, and context haven’t changed.
 * By using memo, you are telling React that your component complies with this requirement,
 * so React doesn’t need to re-render as long as its props haven’t changed.
 * Even with memo, your component will re-render if its own state changes or if a context that it’s using changes.
 *
 */

/**
 * You should only rely on memo as a performance optimization.
 * If your code doesn’t work without it, find the underlying problem and fix it first.
 * Then you may add memo to improve performance.
 */

/**
 * Even when a component is memoized, it will still re-render when its own state changes.
 * Memoization only has to do with props that are passed to the component from its parent.
 */

/**
 * To get the most out of memo, minimize the times that the props change.
 * For example, if the prop is an object,
 * prevent the parent component from re-creating that object every time by using useMemo.
 *
 * A better way to minimize props changes is to make sure the component accepts the minimum necessary information in its props.
 * For example, it could accept individual values instead of a whole object
 *
 * Even individual values can sometimes be projected to ones that change less frequently.
 * For example, here a component accepts a boolean indicating the presence of a value rather than the value itself
 *
 * When you need to pass a function to memoized component,
 * either declare it outside your component so that it never changes,
 * or useCallback to cache its definition between re-renders.
 *
 */

// In this scenario, if NavLink will be used elsewhere, we should use memo, if it's
// only used in NavLinkItems, we will only need to memoise NavLinkItems (parent component)

const NavLink = ({
  text,
  href,
  onLinkActive,
  isSelected,
}: {
  text: string;
  href: string;
  onLinkActive: (text: string, navLink: HTMLDivElement) => void;
  isSelected: boolean;
}) => {
  const navLinkRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  // TODO: use when other pages are added
  // if (window.location.href === `http://localhost:3000${href}`) {
  //   setIsSelected(true);
  // }
  const createClassNames = () => {
    return isSelected
      ? " text-fuchsia-600 hover:text-fuchsia-500 dark:text-fuchsia-400 dark:hover:text-fuchsia-300 transition-all"
      : " text-gray-600 hover:text-gray-500 dark:text-white/50 hover:dark:text-white/70 transition-all";
  };

  const handleClick = () => {
    setIsActive(!isActive);
    onLinkActive(text, navLinkRef.current as HTMLDivElement);
  };

  return (
    <div
      ref={navLinkRef}
      className={
        "cursor-pointer font-sans text-xl font-semibold" + createClassNames()
      }
    >
      <Link href={href} onClick={handleClick}>
        {text}
      </Link>
    </div>
  );
};

export default NavLink;
