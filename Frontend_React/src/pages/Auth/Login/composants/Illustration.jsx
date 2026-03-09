export default function Illustration() {
  return (
    <svg
      viewBox="0 0 420 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm mx-auto drop-shadow-2xl"
    >
      {/* Board background */}
      <rect
        x="30"
        y="20"
        width="360"
        height="240"
        rx="18"
        fill="white"
        fillOpacity="0.12"
      />
      <rect
        x="30"
        y="20"
        width="360"
        height="240"
        rx="18"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />

      {/* Column headers */}
      {[
        ["À faire", "#ef4444"],
        ["En cours", "#D4AF37"],
        ["Terminé", "#22c55e"],
      ].map(([label, color], ci) => (
        <g key={ci}>
          <rect
            x={50 + ci * 118}
            y="40"
            width="100"
            height="26"
            rx="8"
            fill={color}
            fillOpacity="0.85"
          />
          <text
            x={100 + ci * 118}
            y="57"
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="700"
            fontFamily="Baloo 2, cursive"
          >
            {label}
          </text>
        </g>
      ))}

      {/* Cards — column 1 */}
      {[80, 116, 152].map((y, i) => (
        <g key={i}>
          <rect
            x="50"
            y={y}
            width="100"
            height="28"
            rx="8"
            fill="white"
            fillOpacity={0.18 - i * 0.03}
          />
          <rect
            x="58"
            y={y + 9}
            width={40 + i * 12}
            height="7"
            rx="3.5"
            fill="white"
            fillOpacity="0.5"
          />
          <rect
            x="58"
            y={y + 9}
            width={40 + i * 12}
            height="7"
            rx="3.5"
            fill="white"
            fillOpacity="0.3"
          />
          <circle cx="128" cy={y + 14} r="8" fill="white" fillOpacity="0.2" />
          <text
            x="128"
            y={y + 18}
            textAnchor="middle"
            fill="white"
            fontSize="8"
            fontFamily="Comic Neue, cursive"
            fillOpacity="0.7"
          >
            {["AM", "MN", "FS"][i]}
          </text>
        </g>
      ))}

      {/* Cards — column 2 (highlighted) */}
      <rect
        x="168"
        y="80"
        width="100"
        height="54"
        rx="8"
        fill="#D4AF37"
        fillOpacity="0.25"
      />
      <rect
        x="168"
        y="80"
        width="100"
        height="54"
        rx="8"
        stroke="#D4AF37"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <rect
        x="176"
        y="92"
        width="55"
        height="7"
        rx="3.5"
        fill="white"
        fillOpacity="0.7"
      />
      <rect
        x="176"
        y="104"
        width="38"
        height="6"
        rx="3"
        fill="white"
        fillOpacity="0.4"
      />
      <rect
        x="176"
        y="115"
        width="68"
        height="5"
        rx="2.5"
        fill="#D4AF37"
        fillOpacity="0.6"
      />
      {/* progress bar */}
      <rect
        x="176"
        y="123"
        width="76"
        height="4"
        rx="2"
        fill="white"
        fillOpacity="0.15"
      />
      <rect
        x="176"
        y="123"
        width="48"
        height="4"
        rx="2"
        fill="#D4AF37"
        fillOpacity="0.8"
      />

      <rect
        x="168"
        y="144"
        width="100"
        height="28"
        rx="8"
        fill="white"
        fillOpacity="0.12"
      />
      <rect
        x="176"
        y="153"
        width="44"
        height="7"
        rx="3.5"
        fill="white"
        fillOpacity="0.45"
      />
      <rect
        x="168"
        y="182"
        width="100"
        height="28"
        rx="8"
        fill="white"
        fillOpacity="0.08"
      />
      <rect
        x="176"
        y="191"
        width="58"
        height="7"
        rx="3.5"
        fill="white"
        fillOpacity="0.35"
      />

      {/* Cards — column 3 (done) */}
      {[80, 116].map((y, i) => (
        <g key={i}>
          <rect
            x="286"
            y={y}
            width="100"
            height="28"
            rx="8"
            fill="#22c55e"
            fillOpacity="0.18"
          />
          <rect
            x="294"
            y={y + 9}
            width="50"
            height="7"
            rx="3.5"
            fill="white"
            fillOpacity="0.4"
          />
          {/* checkmark */}
          <circle cx="362" cy={y + 14} r="8" fill="#22c55e" fillOpacity="0.5" />
          <path
            d={`M358 ${y + 14} l3 3 5-5`}
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}

      {/* Bottom bar — avatars */}
      <rect
        x="30"
        y="220"
        width="360"
        height="40"
        rx="0"
        fill="white"
        fillOpacity="0.06"
      />
      <rect
        x="30"
        y="220"
        width="360"
        height="40"
        rx="0"
        ry="0"
        style={{ clipPath: "inset(0px 0px 0px 0px round 0px 0px 18px 18px)" }}
        fill="white"
        fillOpacity="0.06"
      />
      {[0, 1, 2, 3].map((i) => (
        <image
          key={i}
          href={`https://i.pravatar.cc/28?img=${10 + i * 9}`}
          x={50 + i * 22}
          y="226"
          width="28"
          height="28"
          clipPath={`url(#av${i})`}
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <clipPath key={i} id={`av${i}`}>
          <circle cx={64 + i * 22} cy="240" r="14" />
        </clipPath>
      ))}
      <text
        x="152"
        y="244"
        fill="white"
        fillOpacity="0.5"
        fontSize="10"
        fontFamily="Comic Neue, cursive"
      >
        4 membres actifs
      </text>
      {/* notification bell */}
      <circle cx="350" cy="240" r="14" fill="white" fillOpacity="0.1" />
      <path
        d="M350 233 a5 5 0 0 1 5 5v3h2l-2 3h-10l-2-3h2v-3a5 5 0 0 1 5-5z"
        stroke="white"
        strokeOpacity="0.6"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="353" cy="232" r="2" fill="#ef4444" />
    </svg>
  );
}
