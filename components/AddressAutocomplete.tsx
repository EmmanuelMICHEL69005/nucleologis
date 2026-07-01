'use client'
import { useState, useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'

interface AddressResult {
  label: string
  street: string
  city: string
  zip: string
}

interface Props {
  value: string
  onChange: (val: string) => void
  onSelect: (result: AddressResult) => void
  placeholder?: string
  className?: string
}

export default function AddressAutocomplete({ value, onChange, onSelect, placeholder = '12 rue des Lavandes', className = '' }: Props) {
  const [suggestions, setSuggestions] = useState<AddressResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleChange(val: string) {
    onChange(val)
    clearTimeout(timer.current)
    if (val.length < 3) { setSuggestions([]); setOpen(false); return }
    setLoading(true)
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(val)}&limit=5&type=housenumber`)
        const data = await res.json()
        const results: AddressResult[] = (data.features ?? []).map((f: any) => ({
          label: f.properties.label,
          street: f.properties.name,
          city: f.properties.city,
          zip: f.properties.postcode,
        }))
        setSuggestions(results)
        setOpen(results.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  function handleSelect(r: AddressResult) {
    onChange(r.street)
    onSelect(r)
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${className}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
          {loading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"/>
          ) : (
            <MapPin size={15}/>
          )}
        </div>
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={() => handleSelect(r)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 flex items-start gap-2 transition"
              >
                <MapPin size={13} className="text-orange-400 mt-0.5 flex-shrink-0"/>
                <span>
                  <span className="font-medium text-gray-800">{r.street}</span>
                  <span className="text-gray-400"> — {r.city} {r.zip}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
