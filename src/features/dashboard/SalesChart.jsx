import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1; // 占据一整行

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function SalesChart({ bookings, numDays }) {
  const { isDarkMode } = useDarkMode();

  const confirmedNumDays = numDays && numDays > 0 ? numDays : 7;

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), confirmedNumDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    // 对于时间段中的每一个日子
    return {
      label: format(date, "MMM dd"),
      totalSales: bookings // new Date(booking.created_at)将ISO字符串转换为日期对象
        ?.filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => acc + cur.totalPrice, 0),
      extrasSales: bookings
        ?.filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => acc + cur.extrasPrice, 0),
    };
  });

  const colors = isDarkMode
    ? {
        // stroke 轮廓线颜色 fill 填充颜色
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(allDates.at(0), "MMM dd yyyy")} &mdash;{" "}
        {format(allDates.at(-1), "MMM dd yyyy")}{" "}
      </Heading>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label" // label 来自 data
            tick={{ fill: colors.text }} // 轴上的文字标签
            tickLine={{ stroke: colors.text }} // 轴上对应每个刻度的小短线
          />
          <YAxis
            unit="$"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          {/* 定义虚线的样式 4 表示 4 像素实线、4 像素空格的循环 */}
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          {/* 当鼠标移入图表区域时，显示的详情气泡框 */}
          <Area
            dataKey="totalSales"
            type="monotone" // 平滑曲线
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2} // 线条的粗细
            name="Total sales"
            unit="$"
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name="Extras sales"
            unit="$"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
