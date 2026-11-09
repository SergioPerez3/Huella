// Genera el HTML de un cartel A4 de "Se busca" para imprimir o guardar como PDF.
// Se abre en una ventana aparte, así no depende del CSS de la app.
const esc = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const speciesLabel = { dog: "Perro", cat: "Gato", other: "Mascota" };
const sexLabel = { male: "Macho", female: "Hembra" };

const formatDate = (value) => {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
};

const PAW =
  '<svg viewBox="0 0 64 64" fill="#25906a"><circle cx="14" cy="26" r="7"/><circle cx="27" cy="14" r="7"/><circle cx="41" cy="14" r="7"/><circle cx="52" cy="26" r="7"/><path d="M32 30c-10 0-18 9-15 18 2 6 9 6 15 4 6 2 13 2 15-4 3-9-5-18-15-18z"/></svg>';

const wide = ["Señas particulares", "Visto por última vez"];

export const buildPosterHtml = ({ pet, extra, qr, age, preview = false }) => {
  const place = [extra.place, formatDate(extra.date)]
    .filter(Boolean)
    .join(" · ");
  const rows = [
    ["Sexo", sexLabel[pet.sex]],
    ["Edad", age],
    ["Microchip", pet.microchip],
    ["Señas particulares", extra.features],
    ["Visto por última vez", place],
  ].filter(([, value]) => value);

  const subtitle = [speciesLabel[pet.species], pet.breed]
    .filter(Boolean)
    .join(" · ");
  const photo = pet.photo?.url
    ? `<img src="${esc(pet.photo.url)}" alt="${esc(pet.name)}">`
    : PAW;

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Se busca · ${esc(pet.name)}</title>
<style>
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,Helvetica,sans-serif;color:#1b2a26;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.sheet{width:210mm;height:297mm;padding:8mm 12mm;display:flex;flex-direction:column;gap:3mm;background:#fff;overflow:hidden}
.top{background:#c62828;color:#fff;text-align:center;border-radius:6mm;padding:3mm 0}
.top h1{font-size:46pt;letter-spacing:3pt;line-height:1}
.top p{font-size:15pt;margin-top:1.5mm;font-weight:700}
.photo{position:relative;flex:1 1 45mm;min-height:45mm;max-height:105mm;border-radius:6mm;overflow:hidden;background:#dff1e8;display:grid;place-items:center}
.photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.photo svg{width:45mm}
.name{text-align:center}
.name h2{font-size:56pt;color:#0b3d2e;line-height:1.05}
.name p{font-size:24pt;color:#555;margin-top:1mm}
.info{display:grid;grid-template-columns:1fr 1fr;gap:2mm 8mm;font-size:21pt;font-weight:600;line-height:1.1}
.info .w{grid-column:1/-1}
.info b{display:block;font-size:13pt;text-transform:uppercase;letter-spacing:.6pt;color:#667}
.alert{background:#fff3cd;border:1.5pt solid #e0a800;border-radius:3mm;padding:1.5mm 4mm;font-size:19pt;font-weight:700}
.reward{background:#fdecea;border:1.5pt solid #c62828;color:#8e1b1b;border-radius:3mm;padding:1.5mm 4mm;font-size:22pt;font-weight:800;text-align:center}
.contact{margin-top:auto;display:flex;align-items:center;gap:8mm;background:#0b3d2e;color:#fff;border-radius:6mm;padding:4mm 8mm}
.contact>div:first-child{flex:1}
.contact small{display:block;font-size:18pt;opacity:.9}
.contact .tel{font-size:38pt;font-weight:900;letter-spacing:1pt;line-height:1.1;margin-top:1mm}
.qr{flex:none;width:36mm;background:#fff;border-radius:3mm;padding:2mm;text-align:center;color:#0b3d2e;font-size:7pt;font-weight:700;line-height:1.2}
.qr img{display:block;width:100%}
.foot{text-align:center;font-size:8pt;color:#889}
.noprint{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 16px;background:#0b3d2e;color:#fff;font-size:14px}
.noprint button{padding:9px 16px;border:0;border-radius:10px;background:#f2994a;color:#3b2200;font-weight:800;font-size:14px;cursor:pointer}
@media screen{body{background:#e6e6e6}.sheet{margin:16px auto;box-shadow:0 4px 20px rgba(0,0,0,.25)}}
@media print{.noprint{display:none}}
body.pv{background:#fff}body.pv .noprint{display:none}body.pv .sheet{margin:0;box-shadow:none}
</style></head><body${preview ? ' class="pv"' : ""}>
<div class="noprint"><button onclick="window.print()">Imprimir o guardar como PDF</button><span>En el cuadro de impresión, elige «Guardar como PDF» para descargarlo.</span></div>
<div class="sheet">
  <div class="top"><h1>SE BUSCA</h1><p>Ayúdanos a encontrarle, por favor</p></div>
  <div class="photo">${photo}</div>
  <div class="name"><h2>${esc(pet.name)}</h2>${subtitle ? `<p>${esc(subtitle)}</p>` : ""}</div>
  ${rows.length ? `<div class="info">${rows.map(([label, value]) => `<div${wide.includes(label) ? ' class="w"' : ""}><b>${esc(label)}</b>${esc(value)}</div>`).join("")}</div>` : ""}
  ${extra.alert ? `<div class="alert">⚠ ${esc(extra.alert)}</div>` : ""}
  ${extra.reward ? `<div class="reward">${esc(extra.reward)}</div>` : ""}
  <div class="contact">
    <div><small>Si le has visto, llama a ${esc(extra.ownerName || "su familia")}</small><div class="tel">${esc(extra.phone)}</div></div>
    ${qr ? `<div class="qr"><img src="${qr}" alt="QR">Escanea para ver su ficha</div>` : ""}
  </div>
  <div class="foot">Cartel creado con Huella</div>
</div>
</body></html>`;
};
