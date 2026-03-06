const SITE_URL = import.meta.env.VITE_SITE_URL || "https://techcol.com";
const SITE_NAME = "TechCol";
const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dmi0txtoy/image/upload/v1762973077/techcop_vhfqlx.png";

const base = {
  siteName: SITE_NAME,
  locale: "es_CO",
  type: "website",
  image: DEFAULT_IMAGE,
};

export const seoConfig = {
  home: {
    ...base,
    path: "/",
    title: "TechCol | Componentes de Computador en Colombia",
    description:
      "Compra componentes de computador en Colombia: tarjetas graficas, procesadores, memorias RAM y SSD con asesoria y envios nacionales.",
    robots: "index,follow,max-image-preview:large",
  },
  products: {
    ...base,
    path: "/products",
    title: "Catalogo de Componentes PC en Colombia | TechCol",
    description:
      "Explora nuestro catalogo de hardware para PC en Colombia: GPU, CPU, RAM, almacenamiento y mas, con soporte para compatibilidad.",
    robots: "index,follow,max-image-preview:large",
  },
  contact: {
    ...base,
    path: "/contact",
    title: "Asesoria en Componentes de Computador | TechCol",
    description:
      "Contacta a TechCol para asesoria en componentes de computador, compatibilidad de piezas y recomendaciones para tu PC.",
    robots: "index,follow,max-image-preview:large",
  },
  auth: {
    ...base,
    path: "/auth",
    title: "Acceso de Usuario | TechCol",
    description: "Inicia sesion o registrate en TechCol.",
    robots: "noindex,nofollow",
  },
  cart: {
    ...base,
    path: "/cart",
    title: "Carrito de Compras | TechCol",
    description: "Revision de carrito en TechCol.",
    robots: "noindex,nofollow",
  },
  checkout: {
    ...base,
    path: "/checkout",
    title: "Checkout | TechCol",
    description: "Proceso de pago en TechCol.",
    robots: "noindex,nofollow",
  },
  private: {
    ...base,
    path: "/user",
    title: "Panel de Usuario | TechCol",
    description: "Panel privado de TechCol.",
    robots: "noindex,nofollow",
  },
};

export const buildAbsoluteUrl = (path) => `${SITE_URL}${path}`;
