/** Inline SVG icon set (stroke style), replacing emoji in all chrome/UI. */

const PATHS: Record<string, React.ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>,
  pie: <><path d="M12 3a9 9 0 1 0 9 9h-9V3Z" /><path d="M15 3.5A9 9 0 0 1 20.5 9H15V3.5Z" /></>,
  list: <><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" /></>,
  trend: <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  wallet: <><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" /><path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2Z" /><circle cx="16.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-3.5 3.6-6 8-6s8 2.5 8 6" /></>,
  back: <path d="M15 5l-7 7 7 7" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  eye: <><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" /><circle cx="12" cy="12" r="2.6" /></>,
  eyeOff: <><path d="M4 4l16 16" /><path d="M9.9 5.1A10.6 10.6 0 0 1 12 4.9c6.5 0 10 7.1 10 7.1a17 17 0 0 1-3 3.9M6.2 6.2A16 16 0 0 0 2 12s3.5 7.1 10 7.1c1.5 0 2.8-.3 4-.9" /></>,
  edit: <><path d="M4 20h4l11-11a2.1 2.1 0 0 0-3-3L5 17l-1 3Z" /><path d="M13.5 6.5l3 3" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></>,
  transfer: <><path d="M4 8h13" /><path d="M14 4l4 4-4 4" /><path d="M20 16H7" /><path d="M10 12l-4 4 4 4" /></>,
  check: <path d="M4 12.5l5 5L20 6.5" />,
  x: <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>,
  chart: <><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" /></>,
  piggy: <><path d="M5 11a7 6.5 0 0 1 13.6-2H21v4h-1.6a7 6.5 0 0 1-2 2.6V18h-3v-1.3a8 8 0 0 1-3.8 0V18h-3v-2.7A6.6 6.6 0 0 1 5 11Z" /><circle cx="15.5" cy="10" r="1" fill="currentColor" stroke="none" /><path d="M2 10.5v3" /></>,
  coins: <><ellipse cx="9" cy="6.5" rx="6" ry="2.8" /><path d="M3 6.5V12c0 1.5 2.7 2.8 6 2.8s6-1.3 6-2.8V6.5" /><path d="M3 12v5.5c0 1.5 2.7 2.8 6 2.8s6-1.3 6-2.8" /><path d="M21 10v7.5" /><path d="M18 8.7c1.8.4 3 1.2 3 2.1 0 .9-1.2 1.7-3 2.1" /></>,
  calc: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8.5 7h7" /><circle cx="8.5" cy="12" r=".9" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none" /><circle cx="15.5" cy="12" r=".9" fill="currentColor" stroke="none" /><circle cx="8.5" cy="16" r=".9" fill="currentColor" stroke="none" /><circle cx="12" cy="16" r=".9" fill="currentColor" stroke="none" /><circle cx="15.5" cy="16" r=".9" fill="currentColor" stroke="none" /></>,
  bank: <><path d="M3 9l9-5.5L21 9" /><path d="M4 9.5h16" /><path d="M6 9.5V17M10 9.5V17M14 9.5V17M18 9.5V17" /><path d="M3 20.5h18" /><path d="M4 17h16" /></>,
  spark: <><path d="M12 2l2 6.5L20.5 10 14 12l-2 6.5L10 12 3.5 10 10 8.5 12 2Z" /></>,
  key: <><circle cx="8" cy="15" r="4.5" /><path d="M11.5 11.5 20 3" /><path d="M16.5 6.5l3 3" /></>,
};

interface IconProps {
  name: keyof typeof PATHS | string;
  size?: number;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 20, strokeWidth = 1.8, style }: IconProps) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      aria-hidden
    >
      {path}
    </svg>
  );
}
