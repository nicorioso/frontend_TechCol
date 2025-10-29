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
      alttext={alttext}
      className={"mx-auto h-20 w-auto"}
    />
  );
}

export default ImageComponent;