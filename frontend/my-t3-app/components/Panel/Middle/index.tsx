import PlanetList from "./Controls/PlanetList";
import AstroGraph from "./Graph";

// TODO: add i18n support
const Middle = () => {
  return (
    <div className="flex h-fit min-w-min max-w-min flex-col gap-4">
      <AstroGraph />
      <PlanetList
        planets={[
          "太阳",
          "月亮",
          "水星",
          "金星",
          "地球",
          "火星",
          "木星",
          "土星",
          "天王星",
          "海王星",
          "冥王星",
          "上升点",
          "下降点",
          "天顶点",
          "天底点",
        ]}
      />
    </div>
  );
};

export default Middle;
