import { avatarPresets } from '../utils/avatars.js';

const topHair = (color) => <path d="M21 28 C20 14 44 14 43 28 C40 22 24 22 21 28Z" fill={color} />;

const Hair = ({ style, color }) => {
  if (style === 'long') return <path d="M20 30 C18 12 46 12 44 30 L46 48 L18 48Z" fill={color} />;
  if (style === 'curly') {
    return (
      <g fill={color}>
        <circle cx="22" cy="23" r="6" />
        <circle cx="28" cy="17" r="6" />
        <circle cx="36" cy="17" r="6" />
        <circle cx="42" cy="23" r="6" />
      </g>
    );
  }
  if (style === 'bun') {
    return (
      <>
        <circle cx="32" cy="12" r="5" fill={color} />
        {topHair(color)}
      </>
    );
  }
  return topHair(color);
};

const PresetAvatar = ({ id }) => {
  const p = avatarPresets.find((item) => item.id === id);
  if (!p) return null;
  const long = p.style === 'long';

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" fill={p.bg} />
      {long && <Hair style="long" color={p.hair} />}
      <path d="M10 64 C10 50 21 45 32 45 C43 45 54 50 54 64Z" fill={p.shirt} />
      <circle cx="32" cy="29" r="11" fill={p.skin} />
      {long ? topHair(p.hair) : <Hair style={p.style} color={p.hair} />}
      <circle cx="28" cy="30" r="1.3" fill="#2b2b2b" />
      <circle cx="36" cy="30" r="1.3" fill="#2b2b2b" />
      <path d="M28.5 35 Q32 38 35.5 35" stroke="#2b2b2b" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
};

export default PresetAvatar;