// API simulada SOLO para desarrollo/pruebas sin Docker. Imita el formato de la API Laravel real.
// Uso: node scripts/mock-api.mjs   (escucha en :8030, igual que docker-compose de la API)
import http from "node:http";

const products = [
  [1, "Laptop Gamer RTX 4060", "1299.99", 10, "laptop"],
  [2, "Mouse Inalámbrico Ergonómico", "29.90", 50, "mouse"],
  [3, "Teclado Mecánico RGB", "79.50", 30, "keyboard"],
  [4, 'Monitor 27" 144Hz', "329.00", 15, "monitor"],
  [5, "Audífonos Bluetooth Cancelación de Ruido", "149.99", 25, "headphones"],
].map(([id, name, price, stock, seed]) => ({
  id, name, description: `Descripción de ${name}`, price, stock,
  image_url: `https://picsum.photos/seed/${seed}/400/300`,
}));

const send = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  const hasAuth = req.headers.authorization === "Bearer mock-token";
  if (req.headers.accept !== "application/json")
    return send(res, 500, { message: "Falta Accept: application/json" });

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
