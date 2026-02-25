import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const COUNTRY_OPTIONS = [
  { value: 'US', label: 'USA', dialCode: '+1', flag: '🇺🇸' },
  { value: 'MX', label: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { value: 'CO', label: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { value: 'AR', label: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { value: 'ES', label: 'Espana', dialCode: '+34', flag: '🇪🇸' },
  { value: 'PE', label: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { value: 'CL', label: 'Chile', dialCode: '+56', flag: '🇨🇱' },
];

export default function PhoneInput({
  name,
  codeName,
  countryName,
  value,
  codeValue,
  countryValue,
  onChange,
  disabled = false,
  placeholder = '3001234567',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCountry =
    COUNTRY_OPTIONS.find((country) => country.value === countryValue) || COUNTRY_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectCountry = (countryValueSelected) => {
    const country = COUNTRY_OPTIONS.find((item) => item.value === countryValueSelected) || COUNTRY_OPTIONS[0];

    onChange?.({
      target: { name: countryName || `${name}_country`, value: country.value },
    });

    onChange?.({
      target: { name: codeName || `${name}_country_code`, value: country.dialCode },
    });

    setIsOpen(false);
  };

  return (
    <div className="flex w-full items-center rounded-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-cyan-500">
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className="flex w-16 items-center justify-center gap-1 rounded-l-md border-r border-gray-300 bg-gray-50 px-1.5 py-2 focus:outline-none disabled:opacity-50"
          disabled={disabled}
          title={selectedCountry.label}
        >
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full z-20 mt-1 grid w-40 grid-cols-5 gap-1 rounded-md border border-gray-300 bg-white p-2 shadow-lg">
            {COUNTRY_OPTIONS.map((country) => (
              <button
                key={country.value}
                type="button"
                onClick={() => selectCountry(country.value)}
                className={`rounded p-1 text-lg leading-none transition hover:bg-cyan-100 ${
                  selectedCountry.value === country.value ? 'bg-cyan-50' : ''
                }`}
                title={country.label}
                aria-label={country.label}
              >
                {country.flag}
              </button>
            ))}
          </div>
        )}
      </div>

      <span className="px-2 text-sm font-medium text-gray-700">
        {codeValue || selectedCountry.dialCode}
      </span>

      <input
        type="hidden"
        name={codeName || `${name}_country_code`}
        value={codeValue || selectedCountry.dialCode}
        readOnly
      />

      <input
        type="tel"
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-r-md px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
        disabled={disabled}
      />
    </div>
  );
}
