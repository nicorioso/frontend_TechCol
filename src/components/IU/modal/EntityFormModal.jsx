import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import PhoneInput from '../forms/phoneInput';

export default function EntityFormModal({
  isOpen,
  title = 'Crear',
  fields = [],
  values = {},
  onChange,
  onClose,
  onSubmit,
  submitLabel = 'CREAR',
}) {
  const [visiblePasswordFields, setVisiblePasswordFields] = useState({});

  const togglePasswordVisibility = (fieldName) => {
    setVisiblePasswordFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const getInputType = (field) => {
    if (field.type !== 'password') {
      return field.type || 'text';
    }
    return visiblePasswordFields[field.name] ? 'text' : 'password';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-gray-500 dark:text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Cerrar"
          >
            X
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">{field.label}</label>

                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={values[field.name] ?? ''}
                    onChange={onChange}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required={field.required !== false}
                    disabled={field.disabled}
                  >
                    <option value="">Seleccionar...</option>
                    {(field.options || []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'phone' ? (
                  <PhoneInput
                    name={field.name}
                    codeName={field.codeName}
                    countryName={field.countryName}
                    value={values[field.name] ?? ''}
                    codeValue={values[field.codeName || `${field.name}_country_code`] ?? ''}
                    countryValue={values[field.countryName || `${field.name}_country`] ?? field.defaultCountry}
                    onChange={onChange}
                    disabled={field.disabled}
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'file' || field.type === 'image' ? (
                  <>
                    {values[field.name] && typeof values[field.name] === 'string' && (
                      <div className="mb-2">
                        <img
                          src={values[field.name]}
                          alt={field.label}
                          loading="lazy"
                          decoding="async"
                          className="max-h-24 object-contain"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      name={field.name}
                      onChange={onChange}
                      accept={field.accept || '*/*'}
                      className="block w-full text-sm text-gray-700 dark:text-gray-200 dark:text-gray-200"
                      required={field.required !== false}
                      disabled={field.disabled}
                    />
                  </>
                ) : (
                  <div className="relative">
                    <input
                      type={getInputType(field)}
                      name={field.name}
                      value={values[field.name] ?? ''}
                      onChange={onChange}
                      placeholder={field.placeholder || ''}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 pr-10 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required={field.required !== false}
                      disabled={field.disabled}
                      readOnly={field.readOnly}
                    />
                    {field.type === 'password' && (
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field.name)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        aria-label={visiblePasswordFields[field.name] ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {visiblePasswordFields[field.name] ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="rounded-md border border-blue-600 bg-blue-600 px-5 py-2 text-sm font-semibold tracking-wide text-white transition hover:border-blue-700 hover:bg-blue-700"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
