// lib/providers/recipe_provider.dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:html' as html; // For web storage
import '../models/recipe.dart';

class RecipeProvider with ChangeNotifier {
  List<Recipe> _recipes = [];
  int _page = 0;
  bool _hasMore = true;
  bool _isLoading = false;
  String _search = '';
  String _filter = 'all';
  List<int> _likedIds = [];
  bool _showLikedOnly = false;
  String? _authToken;

  List<Recipe> get recipes => _showLikedOnly
      ? _recipes.where((recipe) => _likedIds.contains(recipe.id)).toList()
      : _recipes;

  bool get isLoading => _isLoading;
  bool get hasMore => _hasMore;
  String get filter => _filter;
  bool get showLikedOnly => _showLikedOnly;
  bool get isAuthenticated => _authToken != null;

  RecipeProvider() {
    _loadStoredData();
    fetchRecipes();
  }

  Future<void> _loadStoredData() async {
    try {
      // Use localStorage for web compatibility
      final likedRecipesString = html.window.localStorage['liked_recipes'];
      if (likedRecipesString != null) {
        final List<dynamic> likedList = jsonDecode(likedRecipesString);
        _likedIds = likedList.map((id) => int.parse(id.toString())).toList();
      }

      _authToken = html.window.localStorage['auth_token'];
      notifyListeners();
    } catch (e) {
      print('Error loading stored data: $e');
      // Initialize with empty values if loading fails
      _likedIds = [];
      _authToken = null;
    }
  }

  Future<void> _saveStoredData() async {
    try {
      // Use localStorage for web compatibility
      html.window.localStorage['liked_recipes'] =
          jsonEncode(_likedIds.map((id) => id.toString()).toList());

      if (_authToken != null) {
        html.window.localStorage['auth_token'] = _authToken!;
      } else {
        html.window.localStorage.remove('auth_token');
      }
    } catch (e) {
      print('Error saving stored data: $e');
    }
  }

  void setSearch(String query) {
    _search = query;
    _page = 0;
    _recipes.clear();
    _hasMore = true;
    notifyListeners();
    fetchRecipes();
  }

  void setFilter(String filter) {
    _filter = filter;
    _page = 0;
    _recipes.clear();
    _hasMore = true;
    notifyListeners();
    fetchRecipes();
  }

  void toggleShowLikedOnly() {
    _showLikedOnly = !_showLikedOnly;
    notifyListeners();
  }

  void toggleLike(int recipeId) {
    if (_likedIds.contains(recipeId)) {
      _likedIds.remove(recipeId);
    } else {
      _likedIds.add(recipeId);
    }
    _saveStoredData();
    notifyListeners();
  }

  bool isLiked(int recipeId) {
    return _likedIds.contains(recipeId);
  }

  // Helper function to safely parse integers
  int? _parseInt(dynamic value) {
    if (value == null) return null;
    if (value is int) return value;
    if (value is String) {
      return int.tryParse(value);
    }
    return null;
  }

  // Helper function to safely parse doubles
  double? _parseDouble(dynamic value) {
    if (value == null) return null;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) {
      return double.tryParse(value);
    }
    return null;
  }

  Future<void> fetchRecipes() async {
    if (_isLoading || !_hasMore) return;

    _isLoading = true;
    notifyListeners();

    try {
      final baseUrl = _filter == 'all'
          ? 'http://127.0.0.1:8000/recipes?skip=${_page * 9}&limit=9'
          : 'http://127.0.0.1:8000/recipes?category=$_filter&skip=${_page * 9}&limit=9';

      final response = _search.trim().isEmpty
          ? await http.get(Uri.parse(baseUrl))
          : await http.post(
        Uri.parse('http://127.0.0.1:8000/search'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'query': _search}),
      );

      if (response.statusCode == 200) {
        List data = jsonDecode(response.body);
        if (_search.trim().isNotEmpty && _filter != 'all') {
          data = data.where((r) => r['category'] == _filter).toList();
        }

        // Parse recipes with proper type handling
        final newRecipes = data.map((json) => _parseRecipe(json)).toList();

        if (_page == 0) {
          _recipes = newRecipes;
        } else {
          _recipes.addAll(newRecipes);
        }
        _hasMore = newRecipes.length == 9;
        _page++;
      } else {
        print('Error fetching recipes: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching recipes: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Recipe _parseRecipe(Map<String, dynamic> json) {
    return Recipe(
      id: _parseInt(json['id']) ?? 0,
      recipeName: json['recipe_name']?.toString() ?? 'Unknown Recipe',
      prepTime: _parseInt(json['prep_time']),
      cookTime: _parseInt(json['cook_time']),
      totalTime: _parseInt(json['total_time']),
      servings: _parseInt(json['servings']),
      yieldAmount: _parseInt(json['yield_amount']),
      ingredients: json['ingredients']?.toString(),
      directions: json['directions']?.toString() ?? '',
      rating: _parseDouble(json['rating']),
      url: json['url']?.toString(),
      cuisinePath: json['cuisine_path']?.toString(),
      nutrition: json['nutrition'] is Map<String, dynamic> ? json['nutrition'] : null,
      timing: json['timing']?.toString(),
      imgSrc: json['img_src']?.toString(),
      likes: _parseInt(json['likes']) ?? 0,
      dislikes: _parseInt(json['dislikes']) ?? 0,
      comments: json['comments'] != null
          ? (json['comments'] as List).map((c) => c.toString()).toList()
          : [],
      category: json['category']?.toString(),
    );
  }

  Future<bool> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('http://127.0.0.1:8000/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _authToken = data['token']?.toString();
        await _saveStoredData();
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Login error: $e');
      return false;
    }
  }

  Future<bool> register(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('http://127.0.0.1:8000/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Registration error: $e');
      return false;
    }
  }

  Future<void> logout() async {
    _authToken = null;
    html.window.localStorage.remove('auth_token');
    notifyListeners();
  }

  Future<void> voteRecipe(int recipeId, bool isLike) async {
    try {
      final headers = <String, String>{
        'Content-Type': 'application/json',
      };
      if (_authToken != null) {
        headers['Authorization'] = 'Bearer $_authToken';
      }

      final response = await http.post(
        Uri.parse('http://127.0.0.1:8000/recipes/$recipeId/vote'),
        headers: headers,
        body: jsonEncode({'action': isLike ? 'like' : 'dislike'}),
      );

      if (response.statusCode == 200) {
        // Update the recipe in the list
        final recipeIndex = _recipes.indexWhere((r) => r.id == recipeId);
        if (recipeIndex != -1) {
          if (isLike) {
            _recipes[recipeIndex].likes++;
          } else {
            _recipes[recipeIndex].dislikes++;
          }
          notifyListeners();
        }
      }
    } catch (e) {
      print('Error voting: $e');
    }
  }

  Future<void> addComment(int recipeId, String comment) async {
    try {
      final headers = <String, String>{
        'Content-Type': 'application/json',
      };
      if (_authToken != null) {
        headers['Authorization'] = 'Bearer $_authToken';
      }

      final response = await http.post(
        Uri.parse('http://127.0.0.1:8000/recipes/$recipeId/comment'),
        headers: headers,
        body: jsonEncode({'comment': comment}),
      );

      if (response.statusCode == 200) {
        // Update the recipe in the list
        final recipeIndex = _recipes.indexWhere((r) => r.id == recipeId);
        if (recipeIndex != -1) {
          _recipes[recipeIndex].comments.add(comment);
          notifyListeners();
        }
      }
    } catch (e) {
      print('Error adding comment: $e');
    }
  }
}