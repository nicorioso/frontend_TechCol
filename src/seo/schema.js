import { buildAbsoluteUrl } from "./seoConfig";

export const buildOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TechCol",
  url: buildAbsoluteUrl("/"),
  logo: "https://res.cloudinary.com/dmi0txtoy/image/upload/v1762973077/techcop_vhfqlx.png",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "info@techcol.com",
      telephone: "+57 1 234 5678",
      areaServed: "CO",
      availableLanguage: ["es"],
    },
  ],
});

export const buildProductListSchema = (products = []) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: products.slice(0, 24).map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      name: product?.product_name ?? product?.productName ?? product?.name ?? "Producto",
      image: product?.image ?? product?.imageUrl ?? "",
      offers: {
        "@type": "Offer",
        priceCurrency: "COP",
        price: Number(product?.priceAmount ?? product?.price ?? 0),
        availability:
          Number(product?.stockAmount ?? product?.stock ?? 0) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: buildAbsoluteUrl("/products"),
      },
    },
  })),
});
