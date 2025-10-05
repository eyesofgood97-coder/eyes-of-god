import { Eye } from "lucide-react";

export function LeLoLogo() {
  return (
    <div className="flex items-center space-x-2">
      <Eye />
      <span className="text-xl font-bold text-foreground">EoG</span>
      <div className="absolute inset-0 rounded-full blur-lg bg-blue-500/20 opacity-0 hover:opacity-100 transition duration-700" />
    </div>
  );
}
