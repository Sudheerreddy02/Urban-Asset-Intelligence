import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color?: string;
}

export default function KPICard({ title, value, icon, color = "text-sky-400" }: KPICardProps) {
  return (
    <div className="glass-card p-5 rounded-xl flex flex-col gap-3 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-150 transition-transform duration-500">
        <div className={`w-24 h-24 ${color} *:w-full *:h-full`}>{icon}</div>
      </div>
      <div className={`w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center border border-slate-700 shadow-inner ${color}`}>
        {icon}
      </div>
      <div>
         <h4 className="text-slate-400 text-sm font-medium mb-1">{title}</h4>
         <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
