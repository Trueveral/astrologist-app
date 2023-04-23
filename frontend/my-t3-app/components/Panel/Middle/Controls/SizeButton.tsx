const SizeButton = ({
  graph,
  text,
}: {
  graph: HTMLElement | null;
  text: string;
}) => {
  return (
    <div className=" h-10 w-16 cursor-pointer rounded-lg bg-gray-400/50 p-2  text-center font-sans text-xl font-bold text-gray-500 transition-all hover:bg-gray-400/25">
      {text}
    </div>
  );
};

export default SizeButton;
