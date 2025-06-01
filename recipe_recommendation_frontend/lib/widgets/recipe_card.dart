// lib/widgets/recipe_card.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/recipe.dart';
import '../providers/recipe_provider.dart';

class RecipeCard extends StatelessWidget {
  final Recipe recipe;

  const RecipeCard({Key? key, required this.recipe}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<RecipeProvider>(
      builder: (context, provider, child) {
        return Card(
          color: const Color(0xFF052C4C).withOpacity(0.88),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image with proper error handling
              _buildRecipeImage(),

              // Content
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        recipe.recipeName,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),

                      Expanded(
                        child: Text(
                          recipe.directions.length > 80
                              ? '${recipe.directions.substring(0, 80)}...'
                              : recipe.directions,
                          style: TextStyle(
                            color: Colors.grey[300],
                            fontSize: 12,
                          ),
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),

                      // Rating and timing
                      Row(
                        children: [
                          if (recipe.rating != null)
                            Text(
                              '⭐ ${recipe.rating!.toStringAsFixed(1)}',
                              style: TextStyle(color: Colors.yellow[600], fontSize: 12),
                            ),
                          const Spacer(),
                          if (recipe.totalTime != null)
                            Text(
                              '⏱️ ${recipe.totalTime}min',
                              style: const TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                        ],
                      ),

                      const SizedBox(height: 8),

                      // Action buttons
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          // Like button
                          IconButton(
                            onPressed: () => provider.toggleLike(recipe.id),
                            icon: Icon(
                              provider.isLiked(recipe.id)
                                  ? Icons.favorite
                                  : Icons.favorite_border,
                              color: provider.isLiked(recipe.id)
                                  ? Colors.red
                                  : Colors.white70,
                              size: 20,
                            ),
                          ),

                          // Thumbs up
                          Row(
                            children: [
                              IconButton(
                                onPressed: provider.isAuthenticated
                                    ? () => provider.voteRecipe(recipe.id, true)
                                    : null,
                                icon: const Icon(Icons.thumb_up, size: 18),
                                color: Colors.green,
                              ),
                              Text(
                                '${recipe.likes}',
                                style: const TextStyle(color: Colors.white70, fontSize: 12),
                              ),
                            ],
                          ),

                          // Thumbs down
                          Row(
                            children: [
                              IconButton(
                                onPressed: provider.isAuthenticated
                                    ? () => provider.voteRecipe(recipe.id, false)
                                    : null,
                                icon: const Icon(Icons.thumb_down, size: 18),
                                color: Colors.red,
                              ),
                              Text(
                                '${recipe.dislikes}',
                                style: const TextStyle(color: Colors.white70, fontSize: 12),
                              ),
                            ],
                          ),

                          // Comments
                          IconButton(
                            onPressed: () => _showCommentsDialog(context, provider),
                            icon: const Icon(Icons.comment, size: 18, color: Colors.blue),
                          ),
                        ],
                      ),

                      // Read more button
                      if (recipe.directions.length > 80)
                        Center(
                          child: TextButton(
                            onPressed: () => _showRecipeDetails(context),
                            child: Text(
                              'Read More 🍃',
                              style: TextStyle(color: Colors.green[400], fontSize: 12),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildRecipeImage() {
    if (recipe.imgSrc != null && recipe.imgSrc!.isNotEmpty) {
      return ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
        child:
        Image.network(
          'https://api.allorigins.win/raw?url=${recipe.imgSrc!}',
          height: 160,
          width: double.infinity,
          fit: BoxFit.cover,
          loadingBuilder: (context, child, loadingProgress) {
            if (loadingProgress == null) return child;
            return Container(
              height: 160,
              decoration: const BoxDecoration(
                color: Color(0xFFF0F0F0),
                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
              ),
              child: Center(
                child: CircularProgressIndicator(
                  value: loadingProgress.expectedTotalBytes != null
                      ? loadingProgress.cumulativeBytesLoaded /
                      loadingProgress.expectedTotalBytes!
                      : null,
                  color: Colors.grey,
                ),
              ),
            );
          },
          errorBuilder: (context, error, stackTrace) {
            // This will handle CORS errors and other network issues
            return Container(
              height: 160,
              decoration: const BoxDecoration(
                color: Color(0xFFF0F0F0),
                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
              ),
              child: const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.restaurant, size: 40, color: Colors.grey),
                    SizedBox(height: 8),
                    Text(
                      'Image unavailable',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      );
    } else {
      return Container(
        height: 160,
        decoration: const BoxDecoration(
          color: Color(0xFFF0F0F0),
          borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
        ),
        child: const Center(
          child: Icon(Icons.restaurant, size: 50, color: Colors.grey),
        ),
      );
    }
  }

  void _showRecipeDetails(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(recipe.recipeName),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Image with error handling in dialog too
              if (recipe.imgSrc != null && recipe.imgSrc!.isNotEmpty)
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    'https://api.allorigins.win/raw?url=${recipe.imgSrc!}',
                    height: 200,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) return child;
                      return Container(
                        height: 200,
                        color: Colors.grey[300],
                        child: const Center(
                          child: CircularProgressIndicator(),
                        ),
                      );
                    },
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        height: 200,
                        color: Colors.grey[300],
                        child: const Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.restaurant, size: 50, color: Colors.grey),
                              SizedBox(height: 8),
                              Text(
                                'Image unavailable',
                                style: TextStyle(color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              const SizedBox(height: 16),

              if (recipe.ingredients != null && recipe.ingredients!.isNotEmpty) ...[
                const Text(
                  'Ingredients:',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 8),
                ...recipe.ingredients!.split(',').map((ingredient) =>
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 2),
                      child: Text('• ${ingredient.trim()}'),
                    )
                ),
                const SizedBox(height: 16),
              ],

              const Text(
                'Directions:',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),
              Text(recipe.directions),

              const SizedBox(height: 16),

              // Recipe info
              if (recipe.prepTime != null || recipe.cookTime != null ||
                  recipe.totalTime != null || recipe.servings != null)
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (recipe.prepTime != null)
                        Text('Prep Time: ${recipe.prepTime} minutes'),
                      if (recipe.cookTime != null)
                        Text('Cook Time: ${recipe.cookTime} minutes'),
                      if (recipe.totalTime != null)
                        Text('Total Time: ${recipe.totalTime} minutes'),
                      if (recipe.servings != null)
                        Text('Servings: ${recipe.servings}'),
                      if (recipe.category != null)
                        Text('Category: ${recipe.category}'),
                    ],
                  ),
                ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showCommentsDialog(BuildContext context, RecipeProvider provider) {
    final commentController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: Text('Comments (${recipe.comments.length})'),
          content: SizedBox(
            width: double.maxFinite,
            height: 300,
            child: Column(
              children: [
                Expanded(
                  child: recipe.comments.isEmpty
                      ? const Center(
                    child: Text('No comments yet. Be the first to comment!'),
                  )
                      : ListView.builder(
                    itemCount: recipe.comments.length,
                    itemBuilder: (context, index) {
                      return ListTile(
                        leading: const CircleAvatar(
                          child: Icon(Icons.person),
                        ),
                        title: Text(recipe.comments[index]),
                        dense: true,
                      );
                    },
                  ),
                ),
                const Divider(),
                if (provider.isAuthenticated)
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: commentController,
                          decoration: const InputDecoration(
                            hintText: 'Add a comment...',
                            border: OutlineInputBorder(),
                          ),
                          maxLines: 2,
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: () async {
                          if (commentController.text.trim().isNotEmpty) {
                            await provider.addComment(recipe.id, commentController.text.trim());
                            commentController.clear();
                            setState(() {});
                          }
                        },
                        child: const Text('Post'),
                      ),
                    ],
                  )
                else
                  const Text(
                    'Please log in to add comments',
                    style: TextStyle(color: Colors.grey),
                  ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Close'),
            ),
          ],
        ),
      ),
    );
  }
}