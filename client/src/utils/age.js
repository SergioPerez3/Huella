export const getAge = (birthDate) => {
  if (!birthDate) return '';
  const diff = Date.now() - new Date(birthDate).getTime();
  const years = Math.floor(diff / (365.25 * 24 * 3600 * 1000));
  if (years >= 1) return `${years} ${years === 1 ? 'año' : 'años'}`;
  const months = Math.max(Math.floor(diff / (30.44 * 24 * 3600 * 1000)), 0);
  return `${months} ${months === 1 ? 'mes' : 'meses'}`;
};