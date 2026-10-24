// API simulada SOLO para desarrollo/pruebas sin Docker. Imita el formato de la API Laravel real.
// Uso: node scripts/mock-api.mjs   (escucha en :8030, igual que docker-compose de la API)
import http from "node:http";

const products = [
  [1, "Laptop Gamer RTX 4060", "1299.99", 10, "laptop"],
  [2, "Mouse Inalámbrico Ergonómico", "29.90", 50, "mouse"],
  [3, "Teclado Mecánico RGB", "79.50", 3, "keyboard"],
  [4, 'Monitor 27" 144Hz', "329.00", 0, "monitor"],
  [5, "Audífonos Bluetooth Cancelación de Ruido", "149.99", 25, "headphones"],
].map(([id, name, price, stock, seed]) => ({
  id, name, description: `Descripción de ${name}`, price, stock,
  image_url: `http://localhost:8030/img/${seed}.svg`,
}));

const send = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};

const DELAY = Number(process.env.MOCK_DELAY_MS ?? 0); // simula API lenta para ver los esqueletos de carga

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  // Imagenes SVG generadas (solo para pruebas locales sin internet)
  const img = url.pathname.match(/^\/img\/(\w+)\.svg$/);
  if (img) {
    const hue = [...img[1]].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    res.writeHead(200, { "Content-Type": "image/svg+xml" });
    return res.end(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},45%,22%)"/><stop offset="1" stop-color="hsl(${(hue + 40) % 360},50%,12%)"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><rect x="130" y="95" width="140" height="110" rx="10" fill="none" stroke="hsl(${hue},60%,70%)" stroke-width="4"/><circle cx="200" cy="150" r="22" fill="hsl(${hue},60%,70%)"/></svg>`);
  }
  const hasAuth = req.headers.authorization === "Bearer mock-token";
  if (req.headers.accept !== "application/json")
    return send(res, 500, { message: "Falta Accept: application/json" });

  if (DELAY && url.pathname.startsWith("/api/products")) await new Promise((r) => setTimeout(r, DELAY));

  if (url.pathname === "/api/products") return send(res, 200, products);
  const m = url.pathname.match(/^\/api\/products\/(\d+)$/);
  if (m) {
    const p = products.find((x) => x.id === Number(m[1]));
    return p ? send(res, 200, p) : send(res, 404, { message: "No query results for model [App\\Models\\Product]" });
  }
  if (url.pathname === "/api/auth/me")
    return hasAuth ? send(res, 200, { id: 1, name: "Jaime", email: "j@x.com" }) : send(res, 401, { message: "Unauthenticated." });
  if (url.pathname === "/api/auth/login" && req.method === "POST")
    return send(res, 401, { message: "Credenciales inválidas" });
  send(res, 404, { message: "Not found" });
}).listen(8030, () => console.log("mock api on :8030"));
