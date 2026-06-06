import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
  darkMode?: boolean;
  emptyLabel?: string;
  className?: string;
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  darkMode = false,
  emptyLabel = 'None',
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 cursor-pointer ${
          darkMode
            ? 'bg-gray-750 border-gray-600 text-white hover:bg-gray-700/85 focus:ring-2 focus:ring-green-500'
            : 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100/50 focus:ring-2 focus:ring-green-500'
        }`}
      >
        <span className={`truncate ${!selectedOption ? (darkMode ? 'text-gray-400' : 'text-gray-550') : ''}`}>
          {selectedOption ? selectedOption.label : emptyLabel}
        </span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-green-500' : 'text-gray-400'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-[100] mt-1.5 p-2 rounded-2xl border shadow-xl max-h-[300px] flex flex-col ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          {/* Search Input bar */}
          <div className="relative flex items-center mb-2 px-1">
            <Search size={14} className="absolute left-3.5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={placeholder}
              className={`w-full pl-8 pr-7 py-1.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-green-500 transition-all ${
                darkMode
                  ? 'bg-gray-900 border-gray-750 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-250 text-gray-900 placeholder-gray-400'
              }`}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 text-gray-400 hover:text-green-500"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Scrollable list */}
          <div className="overflow-y-auto flex-1 max-h-[220px] custom-scrollbar space-y-0.5">
            {/* Empty selection option */}
            {!search && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  value === ''
                    ? 'bg-green-600 text-white'
                    : darkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-750'
                }`}
              >
                {emptyLabel}
              </button>
            )}

            {filteredOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 text-xs rounded-lg font-medium transition-colors truncate cursor-pointer ${
                  value === opt.value
                    ? 'bg-green-600 text-white font-bold'
                    : darkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-750'
                }`}
              >
                {opt.label}
              </button>
            ))}

            {filteredOptions.length === 0 && (
              <div className="text-center py-3 text-xs text-gray-400">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
