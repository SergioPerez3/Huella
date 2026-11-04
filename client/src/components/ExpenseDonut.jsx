import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { categories, formatMoney } from "../utils/expenses.js";

const categoryOf = (key) => categories[key] || categories.other;

const ExpenseDonut = ({ byCategory, total }) => {
  const data = byCategory.map((c) => ({
    name: categoryOf(c.category).label,
    value: c.total,
    color: categoryOf(c.category).color,
  }));

  return (
    <div className="mini-donut">
      <div className="mini-donut-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={44}
              outerRadius={68}
              paddingAngle={2}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatMoney(value)} />
          </PieChart>
        </ResponsiveContainer>
        <strong className="mini-donut-total">{formatMoney(total)}</strong>
      </div>
      <ul className="legend">
        {data.slice(0, 4).map((item) => (
          <li key={item.name}>
            <span className="dot" style={{ background: item.color }} />
            <span className="legend-label">{item.name}</span>
            <strong>{formatMoney(item.value)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseDonut;
