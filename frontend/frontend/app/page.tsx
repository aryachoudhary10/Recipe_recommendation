"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";

interface Recipe {
  id: number;
  recipe_name: string;
  prep_time?: number;
  cook_time?: number;
  total_time?: number;
  servings?: number;
  yield_amount?: number;
  ingredients?: string;
  directions: string;
  rating?: number;
  url?: string;
  cuisine_path?: string;
  nutrition?: Record<string, any>;
  timing?: string;
  img_src?: string;
  likes: number;
  dislikes: number;
  comments: string[];
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (search.trim().length === 0) {
        const response = await axios.get("http://127.0.0.1:8000/recipes");
        setRecipes(response.data);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post("http://127.0.0.1:8000/search", { query: search });
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
      setLoading(false);
    };

    const delay = setTimeout(fetchRecipes, 500); // 500ms debounce
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="flex flex-col min-h-screen text-[#2D1E2F] transition-all duration-300">
      {/* 🌿 Custom Google Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&display=swap');
        `}
      </style>

      {/* 🌌 Header Section */}
      <header className="text-center py-8">
        <h1
          className="text-5xl drop-shadow-lg"
          style={{
            fontFamily: "'Cinzel Decorative', cursive",
            textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)",
            color: "#2D1E2F", // Dark Color
          }}
        >
          🍃 Enchanted Recipe Book 🍵
        </h1>
      </header>

      {/* 🔍 Search Section */}
      <div className="flex justify-center mb-6 px-4">
        <input
          type="text"
          placeholder="Search for enchanting flavors... 🌸"
          className="w-full max-w-2xl p-3 rounded-full border-2 border-[#A88D83] bg-transparent text-[#2D1E2F] focus:ring-2 focus:ring-[#A88D83] focus:outline-none shadow-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ⏳ Loading Indicator */}
      {loading && <p className="text-center text-[#2D1E2F] italic">Gathering magic ingredients...</p>}

      {/* 📜 Recipe List */}
      <main className="flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-10">
          {recipes.length > 0 ? (
            recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
          ) : (
            !loading && (
              <p className="text-[#2D1E2F] text-center col-span-3 italic">
                No recipes found... Did the spirits take them away? 🏡✨
              </p>
            )
          )}
        </div>
      </main>

      {/* 📍 Footer */}
      <footer className="text-center py-4 text-[#2D1E2F] text-sm">
        Crafted with 🍃 Magic & Love ✨
      </footer>
    </div>
  );
}
