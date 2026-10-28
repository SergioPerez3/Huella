const signatures = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) =>
    b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])),
  "image/webp": (b) =>
    b.subarray(0, 4).toString() === "RIFF" &&
    b.subarray(8, 12).toString() === "WEBP",
  "application/pdf": (b) => b.subarray(0, 4).toString() === "%PDF",
};

export const matchesSignature = (file) =>
  Boolean(signatures[file.mimetype]?.(file.buffer));
