# Evidencias

Coloca aquí las capturas pedidas en la guía (nombres sugeridos):

| Archivo | Qué muestra |
| --- | --- |
| `swagger-api.png` | Swagger de la API en `http://localhost:8030/api/documentation` |
| `flujo-01-catalogo.png` | Catálogo |
| `flujo-02-carrito.png` | Carrito |
| `flujo-03-checkout.png` | Checkout / pedido creado |
| `flujo-04-pago.png` | Formulario de pago de Stripe |
| `flujo-05-pagado.png` | Pedido pagado |
| `flujo-06-historial.png` | Historial en `/pedidos` |
| `lighthouse-home.png` | Reporte de Lighthouse de `/` |
| `lighthouse-producto.png` | Reporte de Lighthouse de `/productos/1` |

## Cómo medir Lighthouse

Mide siempre sobre la versión de **producción**, en una ventana de incógnito y con las extensiones desactivadas:

```bash
pnpm build && pnpm start        # http://localhost:3000
```

Chrome → DevTools (F12) → pestaña **Lighthouse** → categorías Performance, Accessibility, Best Practices y SEO → **Analyze page load**. Repite en modo *Mobile* y *Desktop*.

Medido en desarrollo, el rendimiento sale mucho peor: no uses `pnpm dev` para la evidencia.
