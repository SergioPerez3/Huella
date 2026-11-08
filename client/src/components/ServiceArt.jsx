// Ilustraciones de cada categoría de servicio (SVG propio, sin imágenes externas).
const art = {
  veterinarios: (
    <>
      <circle cx="350" cy="30" r="90" fill="#fff" opacity=".07" />
      <circle cx="40" cy="220" r="80" fill="#fff" opacity=".07" />
      <g fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round">
        <path d="M150 38v52a50 50 0 0 0 100 0V38" />
        <path d="M200 140v34" />
      </g>
      <circle cx="150" cy="34" r="9" fill="#fff" />
      <circle cx="250" cy="34" r="9" fill="#fff" />
      <circle cx="200" cy="198" r="26" fill="#fff" />
      <circle cx="200" cy="198" r="11" fill="#25906a" />
      <g fill="#fff">
        <rect x="310" y="48" width="14" height="44" rx="5" />
        <rect x="295" y="63" width="44" height="14" rx="5" />
      </g>
      <g transform="translate(85 150) scale(1.4)" fill="#f2994a">
        <path d="M0 8c-7-6-16-1-16 6 0 9 16 18 16 18s16-9 16-18c0-7-9-12-16-6z" />
      </g>
      <g transform="translate(318 150) scale(0.8)" fill="#fff" opacity="0.35">
        <circle cx="14" cy="26" r="7" />
        <circle cx="27" cy="14" r="7" />
        <circle cx="41" cy="14" r="7" />
        <circle cx="52" cy="26" r="7" />
        <path d="M32 30c-10 0-18 9-15 18 2 6 9 6 15 4 6 2 13 2 15-4 3-9-5-18-15-18z" />
      </g>
    </>
  ),
  peluquerias: (
    <>
      <circle cx="350" cy="30" r="90" fill="#fff" opacity=".07" />
      <circle cx="40" cy="220" r="80" fill="#fff" opacity=".07" />
      <g
        transform="translate(185 125) rotate(-28)"
        fill="#fff"
        stroke="#fff"
        strokeLinejoin="round"
      >
        <polygon points="-6,3 112,-17 112,-10 -6,-3" strokeWidth="4" />
        <polygon points="-6,-3 112,17 112,10 -6,3" strokeWidth="4" />
        <g fill="none" strokeWidth="9" strokeLinecap="round">
          <path d="M0 0L-46 -28" />
          <path d="M0 0L-46 28" />
          <circle cx="-60" cy="-36" r="21" />
          <circle cx="-60" cy="36" r="21" />
        </g>
        <circle r="7" fill="#f2994a" stroke="none" />
      </g>
      <rect x="268" y="168" width="100" height="16" rx="6" fill="#fff" />
      <g fill="#fff">
        <rect x="274" y="184" width="6" height="22" rx="3" />
        <rect x="288" y="184" width="6" height="22" rx="3" />
        <rect x="302" y="184" width="6" height="22" rx="3" />
        <rect x="316" y="184" width="6" height="22" rx="3" />
        <rect x="330" y="184" width="6" height="22" rx="3" />
        <rect x="344" y="184" width="6" height="22" rx="3" />
        <rect x="358" y="184" width="6" height="22" rx="3" />
      </g>
      <g fill="none" stroke="#fff" strokeWidth="3" opacity=".7">
        <circle cx="330" cy="60" r="16" />
        <circle cx="362" cy="96" r="9" />
        <circle cx="300" cy="100" r="7" />
        <circle cx="70" cy="60" r="12" />
        <circle cx="100" cy="32" r="6" />
      </g>
      <g transform="translate(50 150) scale(0.8)" fill="#fff" opacity="0.35">
        <circle cx="14" cy="26" r="7" />
        <circle cx="27" cy="14" r="7" />
        <circle cx="41" cy="14" r="7" />
        <circle cx="52" cy="26" r="7" />
        <path d="M32 30c-10 0-18 9-15 18 2 6 9 6 15 4 6 2 13 2 15-4 3-9-5-18-15-18z" />
      </g>
    </>
  ),
  residencias: (
    <>
      <circle cx="350" cy="30" r="90" fill="#fff" opacity=".07" />
      <circle cx="40" cy="220" r="80" fill="#fff" opacity=".07" />
      <path
        d="M200 50L304 130H96Z"
        fill="#fff"
        stroke="#fff"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <rect x="126" y="126" width="148" height="86" rx="8" fill="#fff" />
      <rect x="180" y="150" width="40" height="62" rx="20" fill="#d9772a" />
      <rect x="140" y="146" width="30" height="30" rx="6" fill="#ffe3c6" />
      <rect x="230" y="146" width="30" height="30" rx="6" fill="#ffe3c6" />
      <g transform="translate(200 86) scale(1.1)" fill="#d9772a">
        <path d="M0 8c-7-6-16-1-16 6 0 9 16 18 16 18s16-9 16-18c0-7-9-12-16-6z" />
      </g>
      <g transform="translate(40 40) scale(0.7)" fill="#fff" opacity="0.35">
        <circle cx="14" cy="26" r="7" />
        <circle cx="27" cy="14" r="7" />
        <circle cx="41" cy="14" r="7" />
        <circle cx="52" cy="26" r="7" />
        <path d="M32 30c-10 0-18 9-15 18 2 6 9 6 15 4 6 2 13 2 15-4 3-9-5-18-15-18z" />
      </g>
      <g transform="translate(320 150) scale(0.8)" fill="#fff" opacity="0.35">
        <circle cx="14" cy="26" r="7" />
        <circle cx="27" cy="14" r="7" />
        <circle cx="41" cy="14" r="7" />
        <circle cx="52" cy="26" r="7" />
        <path d="M32 30c-10 0-18 9-15 18 2 6 9 6 15 4 6 2 13 2 15-4 3-9-5-18-15-18z" />
      </g>
    </>
  ),
  tiendas: (
    <>
      <circle cx="350" cy="30" r="90" fill="#fff" opacity=".07" />
      <circle cx="40" cy="220" r="80" fill="#fff" opacity=".07" />
      <rect x="145" y="66" width="110" height="140" rx="16" fill="#fff" />
      <rect
        x="153"
        y="50"
        width="94"
        height="26"
        rx="9"
        fill="#fff"
        opacity=".85"
      />
      <circle cx="200" cy="132" r="34" fill="#2f78c4" />
      <g transform="translate(176 108) scale(.75)" fill="#fff">
        <circle cx="14" cy="26" r="7" />
        <circle cx="27" cy="14" r="7" />
        <circle cx="41" cy="14" r="7" />
        <circle cx="52" cy="26" r="7" />
        <path d="M32 30c-10 0-18 9-15 18 2 6 9 6 15 4 6 2 13 2 15-4 3-9-5-18-15-18z" />
      </g>
      <g transform="translate(305 175) rotate(-28)" fill="#fff">
        <rect x="-38" y="-7" width="76" height="14" rx="7" />
        <circle cx="-40" cy="-9" r="10" />
        <circle cx="-40" cy="9" r="10" />
        <circle cx="40" cy="-9" r="10" />
        <circle cx="40" cy="9" r="10" />
      </g>
      <g transform="translate(78 70) scale(1.2)" fill="#f2994a">
        <path d="M0 8c-7-6-16-1-16 6 0 9 16 18 16 18s16-9 16-18c0-7-9-12-16-6z" />
      </g>
    </>
  ),
  cuidadores: (
    <>
      <circle cx="350" cy="30" r="90" fill="#fff" opacity=".07" />
      <circle cx="40" cy="220" r="80" fill="#fff" opacity=".07" />
      <path
        d="M96 168Q200 244 304 168"
        fill="none"
        stroke="#fff"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M96 168Q84 150 70 150"
        fill="none"
        stroke="#fff"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M304 168Q316 150 330 150"
        fill="none"
        stroke="#fff"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <g transform="translate(200 52) scale(3.2)" fill="#fff">
        <path d="M0 8c-7-6-16-1-16 6 0 9 16 18 16 18s16-9 16-18c0-7-9-12-16-6z" />
      </g>
      <g transform="translate(184 98) scale(.5)" fill="#c0426b">
        <circle cx="14" cy="26" r="7" />
        <circle cx="27" cy="14" r="7" />
        <circle cx="41" cy="14" r="7" />
        <circle cx="52" cy="26" r="7" />
        <path d="M32 30c-10 0-18 9-15 18 2 6 9 6 15 4 6 2 13 2 15-4 3-9-5-18-15-18z" />
      </g>
      <g fill="#fff" opacity=".7">
        <rect x="318" y="46" width="8" height="26" rx="4" />
        <rect x="309" y="55" width="26" height="8" rx="4" />
        <rect x="62" y="70" width="6" height="20" rx="3" />
        <rect x="55" y="77" width="20" height="6" rx="3" />
      </g>
    </>
  ),
  paseadores: (
    <>
      <circle cx="350" cy="30" r="90" fill="#fff" opacity=".07" />
      <circle cx="40" cy="220" r="80" fill="#fff" opacity=".07" />
      <path
        d="M70 52C150 46 130 140 205 134S310 96 332 128"
        fill="none"
        stroke="#fff"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle
        cx="62"
        cy="52"
        r="20"
        fill="none"
        stroke="#fff"
        strokeWidth="9"
      />
      <circle cx="336" cy="130" r="12" fill="#fff" />
      <circle cx="336" cy="130" r="5" fill="#f2994a" />
      <g transform="translate(90 168) scale(0.7)" fill="#fff" opacity="0.5">
        <circle cx="14" cy="26" r="7" />
        <circle cx="27" cy="14" r="7" />
        <circle cx="41" cy="14" r="7" />
        <circle cx="52" cy="26" r="7" />
        <path d="M32 30c-10 0-18 9-15 18 2 6 9 6 15 4 6 2 13 2 15-4 3-9-5-18-15-18z" />
      </g>
      <g transform="translate(170 176) scale(0.7)" fill="#fff" opacity="0.4">
        <circle cx="14" cy="26" r="7" />
        <circle cx="27" cy="14" r="7" />
        <circle cx="41" cy="14" r="7" />
        <circle cx="52" cy="26" r="7" />
        <path d="M32 30c-10 0-18 9-15 18 2 6 9 6 15 4 6 2 13 2 15-4 3-9-5-18-15-18z" />
      </g>
      <g transform="translate(250 168) scale(0.7)" fill="#fff" opacity="0.3">
        <circle cx="14" cy="26" r="7" />
        <circle cx="27" cy="14" r="7" />
        <circle cx="41" cy="14" r="7" />
        <circle cx="52" cy="26" r="7" />
        <path d="M32 30c-10 0-18 9-15 18 2 6 9 6 15 4 6 2 13 2 15-4 3-9-5-18-15-18z" />
      </g>
      <g transform="translate(325 176) scale(0.7)" fill="#fff" opacity="0.2">
        <circle cx="14" cy="26" r="7" />
        <circle cx="27" cy="14" r="7" />
        <circle cx="41" cy="14" r="7" />
        <circle cx="52" cy="26" r="7" />
        <path d="M32 30c-10 0-18 9-15 18 2 6 9 6 15 4 6 2 13 2 15-4 3-9-5-18-15-18z" />
      </g>
    </>
  ),
  adiestradores: (
    <>
      <circle cx="350" cy="30" r="90" fill="#fff" opacity=".07" />
      <circle cx="40" cy="220" r="80" fill="#fff" opacity=".07" />
      <circle cx="130" cy="130" r="44" fill="#fff" />
      <rect x="150" y="104" width="122" height="34" rx="12" fill="#fff" />
      <circle cx="130" cy="130" r="14" fill="#c24444" />
      <circle
        cx="124"
        cy="78"
        r="12"
        fill="none"
        stroke="#fff"
        strokeWidth="7"
      />
      <path d="M296 62h60v30a30 30 0 0 1-60 0z" fill="#fff" />
      <path
        d="M296 70h-14a14 14 0 0 0 14 24M356 70h14a14 14 0 0 1-14 24"
        fill="none"
        stroke="#fff"
        strokeWidth="7"
      />
      <rect x="321" y="122" width="10" height="26" fill="#fff" />
      <rect x="304" y="148" width="44" height="12" rx="5" fill="#fff" />
      <path
        d="M326 70l4 10 11 1-8 7 3 11-10-6-10 6 3-11-8-7 11-1z"
        fill="#c24444"
        transform="translate(0 -2)"
      />
      <g transform="translate(80 176) scale(0.7)" fill="#fff" opacity="0.35">
        <circle cx="14" cy="26" r="7" />
        <circle cx="27" cy="14" r="7" />
        <circle cx="41" cy="14" r="7" />
        <circle cx="52" cy="26" r="7" />
        <path d="M32 30c-10 0-18 9-15 18 2 6 9 6 15 4 6 2 13 2 15-4 3-9-5-18-15-18z" />
      </g>
    </>
  ),
};

const ServiceArt = ({ category }) => (
  <div className={`service-art art-${category}`}>
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {art[category] || art.veterinarios}
    </svg>
  </div>
);

export default ServiceArt;
