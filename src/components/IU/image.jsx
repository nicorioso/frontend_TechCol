import React from 'react';
import { getImageById } from '../../hooks/getImageById';

function ImageComponent({style, id, alttext = 'Imagen' }) {
  const image = getImageById(id);

  if (!image) {
    return <p>Imagen no encontrada</p>;
  }

  return (
    <img
      src={image.url}
      alt={alttext}
      loading="lazy"
      decoding="async"
      className={`mx-auto ${style}`}
    />
  );
}

export default ImageComponent;
