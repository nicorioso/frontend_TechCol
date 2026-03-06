import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { buildAbsoluteUrl, seoConfig } from "./seoConfig";

export default function SeoHead({ routeKey, override = {}, schema = null }) {
  const config = { ...(seoConfig[routeKey] || seoConfig.home), ...(override || {}) };
  const canonical = config.canonical || buildAbsoluteUrl(config.path || "/");
  const title = config.title;
  const description = config.description;
  const robots = config.robots || "index,follow";
  const image = config.image;
  const type = config.type || "website";
  const siteName = config.siteName || "TechCol";
  const locale = config.locale || "es_CO";
  const schemaList = Array.isArray(schema) ? schema : schema ? [schema] : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:locale" content={locale} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemaList.map((entry, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
}

SeoHead.propTypes = {
  routeKey: PropTypes.string.isRequired,
  override: PropTypes.object,
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
