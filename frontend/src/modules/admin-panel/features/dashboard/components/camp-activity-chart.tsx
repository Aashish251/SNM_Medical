import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", camps: 4, patients: 320 },
  { name: "Tue", camps: 3, patients: 280 },
  { name: "Wed", camps: 5, patients: 410 },
  { name: "Thu", camps: 4, patients: 350 },
  { name: "Fri", camps: 6, patients: 480 },
  { name: "Sat", camps: 8, patients: 620 },
  { name: "Sun", camps: 5, patients: 390 },
];

export function CampActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <XAxis
          dataKey="name"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Area
          type="monotone"
          dataKey="patients"
          stroke="currentColor"
          className="text-primary"
          fill="currentColor"
          fillOpacity={0.15}
        />
        <Area
          type="monotone"
          dataKey="camps"
          stroke="currentColor"
          className="text-secondary"
          fill="currentColor"
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
