import { readFileSync, writeFileSync } from "node:fs";

const img = (name) => {
  const p = `public/img/${name}`;
  const b = readFileSync(p);
  const mime = p.endsWith(".svg") ? "image/svg+xml" : "image/jpeg";
  return `data:${mime};base64,${b.toString("base64")}`;
};

const names = [
  "hero-dark.jpg","hero-light.jpg","car-purple.jpg","car-pink.jpg","car-orange.jpg",
  "car-pickup.jpg","moto-red.jpg","boat.jpg","heli.jpg","char-lucia.jpg",
  "char-jason.svg","char-cal.svg","char-cop.svg","map-dark.svg","map-light.svg",
  "vice-sunset.svg","diamond.svg","treasure.svg","rifle.svg",
];
const U = Object.fromEntries(names.map((n) => [n.replace(/\.(jpg|svg)$/, ""), img(n)]));

let html = readFileSync("scripts/preview-template.html", "utf8");

// Single dictionary + runtime swap keeps each asset embedded exactly once.
const loader = `<script>
const IMGS=${JSON.stringify(U)};
document.querySelectorAll("img").forEach((i)=>{
  const m=(i.getAttribute("src")||"").match(/^__([a-z-]+)__$/);
  if(m&&IMGS[m[1]])i.src=IMGS[m[1]];
});
</script>`;
html = html.replace("</body>", loader + "</body>");

writeFileSync("preview.html", html);
console.log("preview.html written:", (html.length / 1024 / 1024).toFixed(2), "MB");
