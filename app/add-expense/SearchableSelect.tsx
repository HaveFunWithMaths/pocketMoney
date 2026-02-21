'use client'

import { useState } from 'react'

export function SearchableSelect({
    name,
    options,
    placeholder,
    required
}: {
    name: string,
    options: { id: string, name: string }[],
    placeholder: string,
    required?: boolean
}) {
    const [search, setSearch] = useState('')

    const filteredOptions = options.filter(o =>
        o.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-3">
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
            <select
                name={name}
                id={name}
                required={required}
                defaultValue=""
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
                <option value="" disabled>{placeholder}</option>
                {filteredOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
            </select>
        </div>
    )
}
