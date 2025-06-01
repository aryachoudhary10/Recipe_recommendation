import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/recipe_provider.dart';

class Navbar extends StatelessWidget {
  const Navbar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<RecipeProvider>(
      builder: (context, provider, child) {
        return Container(
          padding: const EdgeInsets.all(16),
          color: const Color(0xFF4a5e80),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              GestureDetector(
                onTap: () => Navigator.pushNamed(context, '/'),
                child: const Row(
                  children: [
                    Text(
                      '🍃',
                      style: TextStyle(fontSize: 24, color: Color(0xFFe3c671)),
                    ),
                    SizedBox(width: 8),
                    Text(
                      'Enchanted Recipes',
                      style: TextStyle(fontSize: 20, color: Color(0xFFe3c671)),
                    ),
                  ],
                ),
              ),
              Row(
                children: [
                  ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/predict-image'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF9C6644),
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Predict from Image'),
                  ),
                  const SizedBox(width: 16),
                  if (provider.isAuthenticated)
                    TextButton(
                      onPressed: () {
                        provider.logout();
                        Navigator.pushNamedAndRemoveUntil(
                          context,
                          '/',
                              (route) => false,
                        );
                      },
                      child: const Text(
                        'Logout',
                        style: TextStyle(color: Color(0xFFe3c671)),
                      ),
                    )
                  else
                    Row(
                      children: [
                        TextButton(
                          onPressed: () => Navigator.pushNamed(context, '/login'),
                          child: const Text(
                            'Login',
                            style: TextStyle(color: Color(0xFFe3c671)),
                          ),
                        ),
                        TextButton(
                          onPressed: () => Navigator.pushNamed(context, '/signup'),
                          child: const Text(
                            'Sign Up',
                            style: TextStyle(color: Color(0xFFe3c671)),
                          ),
                        ),
                      ],
                    ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}