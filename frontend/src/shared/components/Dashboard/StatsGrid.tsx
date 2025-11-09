import React from "react";
import { motion } from "framer-motion";

interface StatItem {
  title: string;
  value: number;
  color: string;
  image?: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <motion.div
          key={stat.title}
          className="bg-white rounded-xl shadow-md p-2 flex items-center justify-between hover:shadow-lg transition-transform"
          whileHover={{ y: -4 }}
        >
          <img src={stat.image} alt={stat.title} className="w-15 h-15" />
          <div className="text-right">
            <div className="text-xl font-bold" style={{ color: stat.color }}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </div>
        </motion.div>
      ))}
    </section>
  );
};
