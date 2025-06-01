import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/recipe_provider.dart';
import '../widgets/navbar.dart';
import '../widgets/search_bar.dart' as custom;
import '../widgets/recipe_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
      final recipeProvider = Provider.of<RecipeProvider>(context, listen: false);
      if (!recipeProvider.isLoading && recipeProvider.hasMore && recipeProvider.filter == 'all') {
        recipeProvider.fetchRecipes();
      }
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFFF8F4F0),
                  Color(0xFFE8DDD4),
                ],
              ),
            ),
          ),
          // Animated Emojis
          ...List.generate(20, (i) {
            return Positioned(
              top: (MediaQuery.of(context).size.height * (i / 20)),
              left: (MediaQuery.of(context).size.width * (i % 5) / 5),
              child: AnimatedOpacity(
                opacity: 0.3,
                duration: const Duration(seconds: 2),
                child: Text(
                  ['🍓', '🍋', '🥕', '🍅', '🍞', '🥦', '🍄', '🧄', '🧅', '🍇'][i % 10],
                  style: const TextStyle(fontSize: 20),
                ),
              ),
            );
          }),
          // Main Content
          Column(
            children: [
               Navbar(),
              Expanded(
                child: SingleChildScrollView(
                  controller: _scrollController,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        Text(
                          '🍃 Enchanted Recipe Book 🍵',
                          style: Theme.of(context).textTheme.headlineLarge,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        const custom.SearchBar(),
                        const SizedBox(height: 16),
                        // Filter Buttons
                        Consumer<RecipeProvider>(
                          builder: (context, provider, child) {
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: ['all', 'veg', 'non-veg'].map((type) {
                                return Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 8),
                                  child: ElevatedButton(
                                    onPressed: () => provider.setFilter(type),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: provider.filter == type
                                          ? const Color(0xFFA88D83)
                                          : Colors.grey,
                                      foregroundColor: Colors.white,
                                    ),
                                    child: Text(
                                      type == 'all'
                                          ? 'All'
                                          : type == 'veg'
                                          ? 'Veg 🌿'
                                          : 'Non-Veg 🍗',
                                    ),
                                  ),
                                );
                              }).toList(),
                            );
                          },
                        ),
                        const SizedBox(height: 16),
                        Consumer<RecipeProvider>(
                          builder: (context, provider, child) {
                            if (provider.isLoading && provider.recipes.isEmpty) {
                              return const Center(
                                child: CircularProgressIndicator(),
                              );
                            }
                            if (provider.recipes.isEmpty) {
                              return const Center(
                                child: Text(
                                  'No recipes found...',
                                  style: TextStyle(fontSize: 18),
                                ),
                              );
                            }
                            return LayoutBuilder(
                              builder: (context, constraints) {
                                int crossAxisCount = 1;
                                if (constraints.maxWidth > 1200) {
                                  crossAxisCount = 3;
                                } else if (constraints.maxWidth > 800) {
                                  crossAxisCount = 2;
                                }

                                return GridView.builder(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: crossAxisCount,
                                    crossAxisSpacing: 16,
                                    mainAxisSpacing: 16,
                                    childAspectRatio: 0.75,
                                  ),
                                  itemCount: provider.recipes.length +
                                      (provider.isLoading ? 1 : 0),
                                  itemBuilder: (context, index) {
                                    if (index == provider.recipes.length) {
                                      return const Center(
                                        child: CircularProgressIndicator(),
                                      );
                                    }
                                    return RecipeCard(recipe: provider.recipes[index]);
                                  },
                                );
                              },
                            );
                          },
                        ),
                        const SizedBox(height: 32),
                        const Text(
                          'Crafted with 🍃 Magic & Love ✨',
                          style: TextStyle(
                            color: Color(0xFF8B4513),
                            fontSize: 16,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          // Sidebar
          // Positioned(
          //   left: 16,
          //   top: 100,
          //   child: Consumer<RecipeProvider>(
          //     builder: (context, provider, child) {
          //       return Container(
          //         width: 250,
          //         padding: const EdgeInsets.all(16),
          //         decoration: BoxDecoration(
          //           color: const Color(0xFFF8F4F0),
          //           border: Border.all(color: const Color(0xFFD4C0B5)),
          //           borderRadius: BorderRadius.circular(12),
          //           boxShadow: [
          //             BoxShadow(
          //               color: Colors.black.withOpacity(0.1),
          //               blurRadius: 4,
          //               offset: const Offset(0, 2),
          //             ),
          //           ],
          //         ),
          //         child: Column(
          //           crossAxisAlignment: CrossAxisAlignment.start,
          //           children: [
          //             Text(
          //               provider.isAuthenticated
          //                   ? '🧝‍♂️ Enchanted User'
          //                   : '👋 Welcome, Guest!',
          //               style: const TextStyle(
          //                 fontSize: 18,
          //                 fontWeight: FontWeight.bold,
          //                 color: Color(0xFF2D1E2F),
          //               ),
          //             ),
          //             Text(
          //               provider.isAuthenticated
          //                   ? 'Welcome back, traveler!'
          //                   : 'Please log in to access more features',
          //               style: TextStyle(
          //                 color: const Color(0xFF2D1E2F).withOpacity(0.7),
          //               ),
          //             ),
          //             const SizedBox(height: 16),
          //             if (provider.isAuthenticated) ...[
          //               ElevatedButton(
          //                 onPressed: () => provider.toggleShowLikedOnly(),
          //                 style: ElevatedButton.styleFrom(
          //                   backgroundColor: const Color(0xFFA88D83),
          //                   foregroundColor: Colors.white,
          //                 ),
          //                 child: Text(
          //                   provider.showLikedOnly
          //                       ? 'Show All Recipes'
          //                       : 'View Liked Recipes ❤️',
          //                 ),
          //               ),
          //               const SizedBox(height: 8),
          //               ElevatedButton(
          //                 onPressed: () => provider.logout(),
          //                 style: ElevatedButton.styleFrom(
          //                   backgroundColor: Colors.red[400],
          //                   foregroundColor: Colors.white,
          //                 ),
          //                 child: const Text('Logout'),
          //               ),
          //             ],
          //           ],
          //         ),
          //       );
          //     },
          //   ),
          // ),
        ],
      ),
    );
  }
}