const searchFields = [
  { label: "Location", placeholder: "Address, City Or Zip" },
  { label: "Date/Duration", placeholder: "Anytime/3 Days" },
  { label: "Budget", placeholder: "$0-$3000" },
  { label: "People", placeholder: "5-10" },
];

export default function SearchBar() {
  return (
    <div className="grid w-full grid-cols-1 border-t border-white/20 bg-black/40 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-5">
      {searchFields.map((field) => (
        <button
          key={field.label}
          type="button"
          className="flex flex-col items-start px-6 py-4 text-left transition-colors hover:bg-white/10 lg:border-l lg:border-white/20 lg:first:border-l-0"
        >
          <span className="text-lg font-semibold text-white">{field.label}</span>
          <span className="text-sm text-white/80">{field.placeholder}</span>
        </button>
      ))}
      <button
        type="button"
        className="bg-cyan-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-cyan-700"
      >
        Search
      </button>
    </div>
  );
}
