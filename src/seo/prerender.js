const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dmi0txtoy/image/upload/v1762973077/techcop_vhfqlx.png";
const BASE_URL = globalThis?.process?.env?.VITE_SITE_URL || "https://techcol.com";

const PAGE_META = {
  "/": {
    title: "TechCol | Componentes de Computador en Colombia",
    description:
      "Compra componentes de computador en Colombia: procesadores, tarjetas graficas, memorias RAM, SSD y mas. Tienda de hardware con asesoria y envios nacionales.",
    html: `
      <main>
        <section>
          <h1>Componentes PC Colombia con asesoria especializada</h1>
          <p>Encuentra hardware para gaming, trabajo y productividad con envios nacionales.</p>
          <a href="/products">Ver catalogo de productos</a>
        </section>
      </main>
    `,
  },
  "/products": {
    title: "Catalogo de Componentes PC en Colombia | TechCol",
    description:
      "Explora nuestro catalogo de hardware para PC en Colombia: GPU, CPU, RAM, almacenamiento y mas, con soporte para compatibilidad.",
    html: `
      <main>
        <section>
          <h1>Catalogo de componentes de computador en Colombia</h1>
          <p>Revisa partes para armar tu PC con asesoramiento de compatibilidad.</p>
          <a href="/">Volver al inicio</a>
        </section>
      </main>
    `,
  },
};

const buildHeadElements = (title, description, url) =>
  new Set([
    { type: "meta", props: { name: "description", content: description } },
    { type: "meta", props: { name: "robots", content: "index,follow,max-image-preview:large" } },
    { type: "link", props: { rel: "canonical", href: url } },
    { type: "meta", props: { property: "og:locale", content: "es_CO" } },
    { type: "meta", props: { property: "og:type", content: "website" } },
    { type: "meta", props: { property: "og:site_name", content: "TechCol" } },
    { type: "meta", props: { property: "og:title", content: title } },
    { type: "meta", props: { property: "og:description", content: description } },
    { type: "meta", props: { property: "og:url", content: url } },
    { type: "meta", props: { property: "og:image", content: DEFAULT_IMAGE } },
    { type: "meta", props: { name: "twitter:card", content: "summary_large_image" } },
    { type: "meta", props: { name: "twitter:title", content: title } },
    { type: "meta", props: { name: "twitter:description", content: description } },
    { type: "meta", props: { name: "twitter:image", content: DEFAULT_IMAGE } },
  ]);

export async function prerender({ url }) {
  const route = PAGE_META[url] || PAGE_META["/"];
  const absoluteUrl = `${BASE_URL}${url}`;

  return {
    html: route.html.trim(),
    links: new Set(["/", "/products"]),
    head: {
      lang: "es-CO",
      title: route.title,
      elements: buildHeadElements(route.title, route.description, absoluteUrl),
    },
  };
}
