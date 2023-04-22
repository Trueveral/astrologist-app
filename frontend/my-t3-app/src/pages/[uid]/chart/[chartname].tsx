import { useRouter } from "next/router";

const Chart = () => {
  const router = useRouter();
  const { uid, chartname } = router.query;
  return (
    <div>
      <h1>Chart: {chartname}</h1>
      <h2>User: {uid}</h2>
    </div>
  );
};

Chart.auth = true;

export default Chart;
