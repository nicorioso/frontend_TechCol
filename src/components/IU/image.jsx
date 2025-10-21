import React from 'react';
import { getImageById } from '../../hooks/getImageById';

function ImageComponent({style, id, altText = 'Imagen' }) {
  const image = getImageById(id);

  if (!image) {
    return <p>Imagen no encontrada</p>;
  }

  return (
    <img
      src={image.url}
      altText={altText}
      className={"mx-auto h-10 w-auto"}
    />
  );
}

export default ImageComponent;