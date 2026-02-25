import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';

export const CollapsibleMenu = ({ 
  icon: Icon,
  label, 
  options = [], 
  onSelectOption
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isEntitiesRoute = location.pathname.includes('/entities');
  const activeOptionValue = location.pathname.split('/').filter(Boolean).at(-1);

  useEffect(() => {
    if (isEntitiesRoute) {
      setIsOpen(true);
    }
  }, [isEntitiesRoute]);

  return (
    <div className="space-y-0">
      <button
        onClick={() => {
          if (isEntitiesRoute) {
            setIsOpen(true);
            return;
          }
          setIsOpen(!isOpen);
        }}
        className={`w-full flex items-center gap-3 p-2 rounded-t-lg transition ${
          isOpen 
            ? 'bg-gray-200 text-gray-800' 
            : 'hover:bg-gray-200 text-gray-700'
        }`}
      >
        {Icon && <Icon className="w-5 h-5" />}
        <span className="text-sm font-medium flex-1 text-left">{label}</span>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="bg-gray-150 rounded-b-lg overflow-hidden border-t border-gray-200">
          {options.map((option, index) => (
            <button
              key={option.value || index}
              onClick={() => {
                onSelectOption?.(option.value);
                if (!isEntitiesRoute) {
                  setIsOpen(false);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition text-left ${
                option.value === activeOptionValue
                  ? 'bg-gray-300 text-gray-900 font-semibold'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.icon && <option.icon className="w-4 h-4 flex-shrink-0" />}
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollapsibleMenu;
