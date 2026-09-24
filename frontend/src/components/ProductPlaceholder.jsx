/**
 * Stand-in for the "after" image Module A's on-device background-removal
 * model would produce. Drawn as inline SVG (not a hotlinked stock photo) on
 * purpose — the demo should never depend on internet access to render its
 * own mock output, especially since Module D is literally about handling
 * no-connectivity scenarios.
 */
export default function ProductPlaceholder({ className = '' }) {
  return (
    <svg viewBox="0 0 160 160" className={className} role="img" aria-label="Cleaned product photo placeholder">
      <rect width="160" height="160" rx="16" fill="#FFFFFF" />
      <rect x="1" y="1" width="158" height="158" rx="15" fill="none" stroke="#C9BBA0" strokeWidth="2" strokeDasharray="4 5" />
      {/* generic folded-textile / craft silhouette */}
      <path
        d="M40 108 L48 58 Q80 40 112 58 L120 108 Q80 122 40 108 Z"
        fill="#2B3A67"
      />
      <path d="M52 64 Q80 50 108 64 L112 108 Q80 118 48 108 Z" fill="#A8322D" opacity="0.9" />
      <path d="M62 70 Q80 62 98 70 L100 104 Q80 112 60 104 Z" fill="#E8A33D" opacity="0.9" />
      <circle cx="80" cy="86" r="8" fill="#FFF8EC" />
    </svg>
  );
}
