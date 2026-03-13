import React, { useRef, useState, useEffect } from 'react';

export default function AvatarUpload({ initialSrc = '', onChange, maxSize = 1 * 1024 * 1024 }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(initialSrc);
  const [error, setError] = useState('');

  useEffect(() => {
    setPreview(initialSrc);
  }, [initialSrc]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleButtonClick() {
    inputRef.current?.click();
  }

  function handleFile(e) {
    setError('');
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setError('Formato no válido. Usa JPG, GIF o PNG.');
      return;
    }

    if (file.size > maxSize) {
      setError(`El archivo excede el tamaño máximo de ${Math.round(maxSize / 1024)} KB.`);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    if (typeof onChange === 'function') onChange(file);
  }

  return (
    <div className="flex items-start gap-4">
      <div className="w-20 h-20 rounded-md overflow-hidden border">
        <img
          src={preview || '/default-avatar.png'}
          alt="avatar"
          loading="lazy"
          decoding="async"
          width="80"
          height="80"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleButtonClick}
            className="px-3 py-2 bg-white border rounded shadow-sm text-sm hover:bg-gray-50"
          >
              Cambiar avatar
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png, image/jpeg, image/gif"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">JPG, GIF o PNG. Máx. {Math.round(maxSize / 1024)}KB.</p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
