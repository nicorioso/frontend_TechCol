import { useState } from 'react';
import { EyeIcon, EyeSlashIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import PhoneInput from '../forms/phoneInput';

export default function EntityFormModal({
  isOpen,
  title = 'Crear',
  fields = [],
  values = {},
  fieldErrors = {},
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white text-gray-800 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200">
        <div className="border-b border-slate-200 bg-[linear-gradient(135deg,rgba(15,23,42,0.05),rgba(148,163,184,0.02))] px-6 py-5 dark:border-slate-700 dark:bg-[linear-gradient(135deg,rgba(148,163,184,0.08),rgba(15,23,42,0.03))]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                Panel De Gestion
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                {title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Completa la informacion y revisa los detalles antes de guardar.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Cerrar"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {field.label}
                </label>

                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={values[field.name] ?? ''}
                    onChange={onChange}
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:bg-slate-900 dark:focus:ring-slate-800"
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
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
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
                  </div>
                ) : field.type === 'file' || field.type === 'image' ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 shadow-sm dark:border-slate-600 dark:bg-slate-800/80">
                    {values[field.name] && typeof values[field.name] === 'string' && (
                      <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                        <img
                          src={values[field.name]}
                          alt={field.label}
                          loading="lazy"
                          decoding="async"
                          className="max-h-28 object-contain"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <PhotoIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                          {values[field.name] instanceof File ? values[field.name].name : 'Selecciona una imagen'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {field.helperText || 'Adjunta un archivo compatible para este campo.'}
                        </p>
                      </div>
                    </div>

                    <input
                      type="file"
                      name={field.name}
                      onChange={onChange}
                      accept={field.accept || '*/*'}
                      className="mt-3 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:file:bg-slate-100 dark:file:text-slate-900 dark:hover:file:bg-slate-300"
                      required={field.required !== false}
                      disabled={field.disabled}
                    />
                    {fieldErrors[field.name] ? (
                      <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                        {fieldErrors[field.name]}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type={getInputType(field)}
                      name={field.name}
                      value={values[field.name] ?? ''}
                      onChange={onChange}
                      placeholder={field.placeholder || ''}
                      className="block w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 pr-11 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:bg-slate-900 dark:focus:ring-slate-800"
                      required={field.required !== false}
                      disabled={field.disabled}
                      readOnly={field.readOnly}
                    />
                    {field.type === 'password' && (
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field.name)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
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

                {field.type !== 'file' && field.type !== 'image' && field.helperText ? (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{field.helperText}</p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
