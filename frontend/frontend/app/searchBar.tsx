// components/SearchBar.tsx
import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    onSearch(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-center mb-4 px-4">
      <input
        type="text"
        placeholder="Search for enchanting flavors... 🌸"
        className="search-bar"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
<button
  onClick={handleSearch}
  className="ml-2 bg-[#A88D83] text-white rounded-full p-3 hover:bg-[#8C6D63] transition cursor-pointer flex items-center justify-center text-xl"
>
  🔍
</button>

    </div>
  );
}
