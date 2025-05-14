// import { motion, AnimatePresence } from "framer-motion";

// interface Recipe {
//   id: number;
//   recipe_name: string;
//   img_src?: string;
//   directions: string;
// }

// export default function RecipeModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
//   return (
//     <AnimatePresence>
//       <motion.div
//         className="fixed inset-0 bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-md"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.5, ease: "easeInOut" }}
//         onClick={onClose} // Close when clicking outside modal
//       >
//         <motion.div
//           className="relative  dark:bg-gray-800/20 p-8 rounded-xl shadow-xl w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[85vh] overflow-y-auto"
//           style={{
//             backdropFilter: "blur(15px)",
//             border: "1px solid rgba(231, 20, 20, 0.2)",
//           }}
//           initial={{ y: -50, opacity: 0, scale: 0.9 }}
//           animate={{ y: 0, opacity: 1, scale: 1 }}
//           exit={{ y: 50, opacity: 0, scale: 0.9 }}
//           transition={{ duration: 0.3, ease: "easeInOut" }}
//           onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()} // Prevent closing when clicking inside
//         >
//           {/* ❌ Close Button */}
//           <button
//             className="absolute top-4 right-4 text-white text-2xl opacity-80 hover:opacity-100 transition-opacity duration-200"
//             onClick={onClose}
//           >
//             &times;
//           </button>

//           {/* 🏷 Recipe Name */}
//           <h2 className="text-2xl font-bold text-white">{recipe.recipe_name}</h2>

//           {/* 🖼 Recipe Image */}
//           {recipe.img_src && (
//             <img
//               src={recipe.img_src}
//               alt={recipe.recipe_name}
//               className="w-full h-48 object-cover rounded-md mt-4 border-2 border-gray-200/50"
//               loading="lazy"
//             />
//           )}

//           {/* 📜 Recipe Directions */}
//           <p className="text-white mt-4 text-lg">{recipe.directions}</p>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }
