import { Activity } from 'lucide-react';

/** App mark: pulse line on a purple rounded square (also used as the favicon). */
export function AppLogo({ size = 32 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm shadow-indigo-900/20"
      style={{ width: size, height: size }}
    >
      <Activity size={Math.round(size * 0.56)} strokeWidth={2.4} />
    </span>
  );
}
