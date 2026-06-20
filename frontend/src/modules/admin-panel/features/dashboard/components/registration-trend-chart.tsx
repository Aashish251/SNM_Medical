import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { name: "Jan", registrations: 820 },
  { name: "Feb", registrations: 932 },
  { name: "Mar", registrations: 901 },
  { name: "Apr", registrations: 1034 },
  { name: "May", registrations: 1090 },
  { name: "Jun", registrations: 1248 },
  { name: "Jul", registrations: 1180 },
  { name: "Aug", registrations: 1210 },
  { name: "Sep", registrations: 1156 },
  { name: "Oct", registrations: 1288 },
  { name: "Nov", registrations: 1340 },
  { name: "Dec", registrations: 1420 },
];

export function RegistrationTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
        <Bar
          dataKey="registrations"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
