const Info = ({
  name = "PNNK",
  date = "1999年11月28日 23:23",
  pos = "东经106° 北纬27°",
}: {
  name: string;
  date: string;
  pos: string;
}) => {
  return (
    <div className="mt-15 ml-10 flex h-fit w-fit flex-col items-start justify-start bg-title bg-clip-text text-transparent">
      <div className="text-3xl font-extrabold">{name}</div>
      <div className="text-2xl font-bold">{date}</div>
      <div className="text-2xl font-bold">{pos}</div>
    </div>
  );
};

export default Info;
