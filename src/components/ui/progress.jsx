import { cn } from "@/lib/utils";

export function Progress({ value = 0, className }) {
  return (
    <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", className)}>
      <div
        className="h-full bg-[#3A7BFF] transition-all duration-500"
        style={{ width: `${value}%`, height: "100%" }}
      />
    </div>
  );
}
