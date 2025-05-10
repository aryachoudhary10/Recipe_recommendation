"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Pastel color palette for a Ghibli-like feel
const pastelColors = [
  "#FFDFD3", // Soft Pink
  "#FFDAC1", // Peach
  "#FCF6BD", // Light Yellow
  "#D0E6A5", // Pale Green
  "#A2E1DB", // Light Teal
  "#B5C6E0", // Soft Blue
  "#E4C1F9", // Lavender
];

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

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [likes, setLikes] = useState(recipe.likes);
  const [dislikes, setDislikes] = useState(recipe.dislikes);
  const [comments, setComments] = useState(recipe.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const MAX_DESCRIPTION_LENGTH = 100;

  // Assign a pastel color to each card
  const cardColor = pastelColors[recipe.id % pastelColors.length];
  const ingredientsArray = recipe.ingredients ? recipe.ingredients.split(",").map((item) => item.trim()) : [];

  // Handle Likes & Dislikes
  const handleVote = async (action: "like" | "dislike") => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/recipes/${recipe.id}/vote`, { action });
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

// Handle Adding a New Comment
const handleAddComment = async () => {
  if (!newComment.trim()) return;

  const newCommentData = newComment; // Store the new comment text
  setComments((prevComments) => [newCommentData, ...prevComments]); // Instantly update UI
  setNewComment(""); // Clear input field immediately

  try {
    const response = await axios.post(`http://127.0.0.1:8000/recipes/${recipe.id}/comment`, {
      comment: newCommentData,
    });

    // If API returns a different comment format, update it correctly
    if (response.data && response.data.comment) {
      setComments((prevComments) => [response.data.comment, ...prevComments.slice(1)]);
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    // If API fails, remove the optimistically added comment
    setComments((prevComments) => prevComments.slice(1));
  }
};


  return (
    <>
      {/* Recipe Card */}
      <div
        className="p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg flex flex-col h-[500px] w-[300px] overflow-hidden border-2"
        style={{ backgroundColor: cardColor, borderColor: "#C8A2C8" }} 
      >
        {/* Recipe Image */}
        {recipe.img_src && (
          <img
            src={recipe.img_src}
            alt={recipe.recipe_name}
            className="w-full h-40 object-cover rounded-md border-2 border-gray-400"
          />
        )}

        {/* Recipe Name */}
        <h2 className="text-xl font-bold text-gray-800 mt-2 truncate">{recipe.recipe_name}</h2>

        {/* Directions (Truncated) */}
        <p className="text-gray-700 text-sm mt-2">
          <strong>Directions:</strong>{" "}
          {recipe.directions.length > MAX_DESCRIPTION_LENGTH
            ? `${recipe.directions.slice(0, MAX_DESCRIPTION_LENGTH)}...`
            : recipe.directions}
        </p>

        {recipe.directions.length > MAX_DESCRIPTION_LENGTH && (
          <button className="text-green-700 hover:underline mt-1" onClick={() => setIsDetailsOpen(true)}>
            Read More 🍃
          </button>
        )}

        {/* Rating */}
        {recipe.rating && (
          <p className="text-yellow-600 mt-2">
            <strong>⭐ {recipe.rating}/5</strong>
          </p>
        )}

        {/* Likes, Dislikes, and Comments */}
        <div className="flex justify-between items-center mt-3">
          <button className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={() => handleVote("like")}>
            👍 {likes}
          </button>
          <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => handleVote("dislike")}>
            👎 {dislikes}
          </button>
          <button className="text-blue-600 hover:underline" onClick={() => setIsCommentsOpen(true)}>
            💬 Comments ({comments.length})
          </button>
        </div>
      </div>

      {/* Recipe Details Modal */}
      <AnimatePresence>
        {isDetailsOpen && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 backdrop-blur-xl z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDetailsOpen(false)}>
            <motion.div className="p-6 rounded-lg shadow-lg max-w-screen-md lg:max-w-screen-lg w-full max-h-[80vh] overflow-y-auto relative border-2" style={{ backgroundColor: cardColor, borderColor: "#C8A2C8" }} onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl" onClick={() => setIsDetailsOpen(false)}>
                &times;
              </button>

              <h2 className="text-2xl font-bold text-gray-800">{recipe.recipe_name}</h2>
              {recipe.img_src && <img src={recipe.img_src} alt={recipe.recipe_name} className="w-full h-40 object-cover rounded-md mt-2" />}
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-800">🛒 Ingredients:</h3>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                  {ingredientsArray.length > 0 ? (
                    ingredientsArray.map((ingredient, index) => <li key={index}>{ingredient}</li>)
                  ) : (
                    <p className="text-gray-500">No ingredients listed.</p>
                  )}
                </ul>
              </div>
              <p className="text-gray-700 mt-2"><strong>Prep Time:</strong> {recipe.prep_time} mins</p>
              <p className="text-gray-700"><strong>Cook Time:</strong> {recipe.cook_time} mins</p>
              <p className="text-gray-700"><strong>Total Time:</strong> {recipe.total_time} mins</p>
              <p className="text-gray-700"><strong>Servings:</strong> {recipe.servings}</p>
              <p className="text-gray-700"><strong>Directions:</strong> {recipe.directions}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 backdrop-blur-xl z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCommentsOpen(false)}>
            <motion.div className="p-6 rounded-lg shadow-lg max-w-md w-full border-2 bg-white" style={{ borderColor: "#C8A2C8" }} onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl" onClick={() => setIsCommentsOpen(false)}>
                &times;
              </button>

              <h3 className="text-lg font-semibold mb-3">Comments</h3>
              <div className="max-h-60 overflow-y-auto space-y-2 border p-2 rounded-lg">
                {comments.length > 0 ? comments.map((comment, index) => <p key={index} className="p-2 bg-gray-100 rounded-lg">{comment}</p>) : <p className="text-gray-500">No comments yet.</p>}
              </div>

              <div className="mt-3 flex">
                <input type="text" className="w-full border rounded-lg p-2" placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <button className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddComment}>
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
