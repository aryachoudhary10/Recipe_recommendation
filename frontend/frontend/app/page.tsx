"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "./searchBar";
import "./styles/home.css";

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
  category?: "veg" | "non-veg";
}

const LIMIT = 9;

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [filter, setFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const storedLikes = localStorage.getItem("likedRecipes");
    if (storedLikes) setLikedIds(JSON.parse(storedLikes));
  }, []);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl =
        filter === "all"
          // ? `http://localhost:8000/recipes?skip=${page * LIMIT}&limit=${LIMIT}`
          // : `http://localhost:8000/recipes?category=${filter}&skip=${page * LIMIT}&limit=${LIMIT}`;
           ? `http://127.0.0.1:8000/recipes?skip=${page * LIMIT}&limit=${LIMIT}`
          : `http://127.0.0.1:8000/recipes?category=${filter}&skip=${page * LIMIT}&limit=${LIMIT}`;

      const response =
        search.trim().length === 0
          ? await axios.get(baseUrl)
          : await axios.post("http://127.0.0.1:8000/search", { query: search });

      let data = response.data;

      if (search.trim().length > 0 && filter !== "all") {
        data = data.filter((r: Recipe) => r.category === filter);
      }

      if (page === 0) {
        setRecipes(data);
      } else {
        setRecipes((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === LIMIT);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false);
    setIsFetchingMore(false);
  }, [page, filter, search]);

  useEffect(() => {
    setPage(0); // reset to first page when filter/search changes
  }, [search, filter]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes, page]);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || isFetchingMore || !hasMore || search) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsFetchingMore(true);
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, isFetchingMore, hasMore, search]
  );

  return (
    <div className="flex min-h-screen text-[#2D1E2F] transition-all duration-300">
      {/* 📌 Sidebar */}
       <aside
    className="hidden lg:block fixed top-24 left-4 w-64 p-4 bg-[#F8F4F0] shadow-lg border-2 border-[#D4C0B5] rounded-xl z-20"
  >
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-[#2D1E2F]">🧝‍♂️ Enchanted User</h2>
      <p className="text-sm text-[#2D1E2F]/70">Welcome back, traveler!</p>
    </div>
    <button
      onClick={() => setShowLikedOnly(!showLikedOnly)}
      className="w-full bg-[#A88D83] text-white py-2 px-3 rounded hover:bg-[#8C6D63] transition cursor-pointer"
    >
      {showLikedOnly ? "Show All Recipes" : "View Liked Recipes ❤️"}
    </button>
  </aside>  

      {/* 📜 Main Section */}
      {/* <div className="ml-69 flex flex-col flex-grow"> */}
      <div className="flex-grow lg:ml-60 w-full mx-auto max-w-full ">
       {/* <div className="flex flex-col flex-grow w-full lg:ml-64 p-8 gap-4"> */}
        <header className="text-center py-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl drop-shadow-lg enchanted-title">
            🍃 Enchanted Recipe Book 🍵
          </h1>
        </header>

        {/* ✅ Lag-free Search Bar */}
        <SearchBar onSearch={(query) => setSearch(query)} />

        {/* Filter Toggle */}
        <div className="flex flex-wrap justify-center mb-6 gap-3 px-4">
          {["all", "veg", "non-veg"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as "all" | "veg" | "non-veg")}
              className={`filter-btn cursor-pointer
                ${filter === type
                  ? type === "veg"
                    ? "active-veg scale-110"
                    : type === "non-veg"
                    ? "active-nonveg scale-110"
                    : "active-all scale-110"
                  : "inactive scale-100"}
                transition-all ease-in-out duration-300 hover:scale-105`}
            >
              {type === "all" ? "All" : type === "veg" ? "Veg 🌿" : "Non-Veg 🍗"}
            </button>
          ))}
        </div>

        {loading && page === 0 && (
          <p className="text-center text-[#f6e591] italic">
            Gathering magic ingredients...
          </p>
        )}

        <main className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-10">
            {(showLikedOnly ? recipes.filter(r => likedIds.includes(r.id)) : recipes).length > 0 ? (
              (showLikedOnly ? recipes.filter(r => likedIds.includes(r.id)) : recipes).map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              !loading && (
                <p className="text-[#f6e591] text-center col-span-3 italic">
                  No recipes found... Did the spirits take them away? 🏡✨
                </p>
              )
            )}
          </div>

          {/* 🔄 Load More Trigger */}
          {!loading && !search && hasMore && (
            <div ref={loadMoreRef} className="text-center py-6 text-[#f6e591]">
              Loading more magic... 🧙‍♀️✨
            </div>
          )}
        </main>

        <footer className="text-center py-4 text-[#f6e591] text-sm">
          Crafted with 🍃 Magic & Love ✨
        </footer>
      </div>
    </div>
  );
}
