class Recipe {
  final int id;
  final String recipeName;
  final int? prepTime;
  final int? cookTime;
  final int? totalTime;
  final int? servings;
  final int? yieldAmount;
  final String? ingredients;
  final String directions;
  final double? rating;
  final String? url;
  final String? cuisinePath;
  final Map<String, dynamic>? nutrition;
  final String? timing;
  final String? imgSrc;
  int likes;
  int dislikes;
  List<String> comments;
  final String? category;

  Recipe({
    required this.id,
    required this.recipeName,
    this.prepTime,
    this.cookTime,
    this.totalTime,
    this.servings,
    this.yieldAmount,
    this.ingredients,
    required this.directions,
    this.rating,
    this.url,
    this.cuisinePath,
    this.nutrition,
    this.timing,
    this.imgSrc,
    required this.likes,
    required this.dislikes,
    required this.comments,
    this.category,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      id: json['id'] ?? 0,
      recipeName: json['recipe_name'] ?? 'Unknown Recipe',
      prepTime: json['prep_time'],
      cookTime: json['cook_time'],
      totalTime: json['total_time'],
      servings: json['servings'],
      yieldAmount: json['yield_amount'],
      ingredients: json['ingredients'],
      directions: json['directions'] ?? '',
      rating: json['rating']?.toDouble(),
      url: json['url'],
      cuisinePath: json['cuisine_path'],
      nutrition: json['nutrition'],
      timing: json['timing'],
      imgSrc: json['img_src'],
      likes: json['likes'] ?? 0,
      dislikes: json['dislikes'] ?? 0,
      comments: json['comments'] != null ? List<String>.from(json['comments']) : [],
      category: json['category'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'recipe_name': recipeName,
      'prep_time': prepTime,
      'cook_time': cookTime,
      'total_time': totalTime,
      'servings': servings,
      'yield_amount': yieldAmount,
      'ingredients': ingredients,
      'directions': directions,
      'rating': rating,
      'url': url,
      'cuisine_path': cuisinePath,
      'nutrition': nutrition,
      'timing': timing,
      'img_src': imgSrc,
      'likes': likes,
      'dislikes': dislikes,
      'comments': comments,
      'category': category,
    };
  }
}
