import Link from "next/link";
import { useEffect } from "react";
import { useSpring, a } from "react-spring";

export type ColContent = {
  title: string;
  content: {
    text: string;
    link: string;
  }[];
};

// because onMouseEnter and onMouseLeave is not bubble up,
// so we need to create a new component for each link
// rather than catch event in document object

const ColItem = ({
  text,
  link,
  order,
}: {
  text: string;
  link: string;
  order: number;
}) => {
  const [{ opacity }, api] = useSpring(() => {
    return {
      to: { opacity: 1 },
      from: { opacity: 0 },
      config: { mass: 5, tension: 2000, friction: 200 },
      delay: order * 50,
    };
  });

  return (
    <a.div
      onMouseEnter={() => {
        api.start({ opacity: 0.7 });
      }}
      onMouseLeave={() => {
        api.start({ opacity: 1 });
      }}
      style={{ opacity }}
      className="font-sans text-gray-400"
    >
      <Link href={link}>{text}</Link>
    </a.div>
  );
};

const Col = ({
  title,
  content,
}: {
  title: string;
  content: {
    text: string;
    link: string;
  }[];
}) => {
  const [{ opacity }] = useSpring(() => ({
    to: { opacity: 1 },
    from: { opacity: 0 },
    config: { mass: 5, tension: 2000, friction: 200 },
    // delay: 50,
  }));

  return (
    <div className="flex flex-col gap-1">
      <a.div
        className="cursor-default font-sans text-gray-500"
        style={{ opacity }}
      >
        {title}
      </a.div>
      {content.map((co, i) => (
        <ColItem key={i} text={co.text} link={co.link} order={i} />
      ))}
    </div>
  );
};

const Detail = ({ content }: { content: ColContent[] }) => {
  return content.length === 0 ? (
    <></>
  ) : (
    <div className="ml-2 flex h-fit flex-row gap-10 pb-2 pt-2">
      {content.map((c, i) => (
        <Col key={i} title={c.title} content={c.content} />
      ))}
    </div>
  );
};

export default Detail;
