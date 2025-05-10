import { motion, AnimatePresence } from "framer-motion";

interface Recipe {
  id: number;
  recipe_name: string;
  img_src?: string;
  directions: string;
}

export default function RecipeModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // Close when clicking outside modal
      >
        <motion.div
          className="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[85vh] overflow-y-auto"
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()} // ✅ Prevent closing when clicking inside
        >
          {/* ❌ Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500"
            onClick={onClose}
          >
            ❌
          </button>

          {/* 🏷 Recipe Name */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{recipe.recipe_name}</h2>

          {/* 🖼 Recipe Image */}
          {recipe.img_src && (
            <img
              src={recipe.img_src}
              alt={recipe.recipe_name}
              className="w-full h-48 object-cover rounded-md mt-4"
              loading="lazy"
            />
          )}

          {/* 📜 Recipe Directions */}
          <p className="text-gray-600 dark:text-gray-300 mt-4">{recipe.directions}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
