const Info = ({
  name = "Test Chart",
  date = "1971年1月1日 23:23",
  pos = "东经106° 北纬27°",
}: {
  name: string;
  date: string;
  pos: string;
}) => {
  return (
    <div className="mt-15 ml-10 flex h-fit min-w-fit select-none flex-col items-start justify-start text-gray-700 text-transparent motion-safe:animate-slide-in-left">
      <div className="text-3xl font-extrabold">{name}</div>
      <div className="text-2xl font-bold">{date}</div>
      <div className="text-2xl font-bold">{pos}</div>
    </div>
  );
};

export default Info;
