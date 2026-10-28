const pick = (body, allowed) =>
  Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));

export default pick;