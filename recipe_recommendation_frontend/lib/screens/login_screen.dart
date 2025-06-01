import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String _error = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          padding: EdgeInsets.all(16),
          width: 400,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            color: Colors.white,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Welcome Back! 👋',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              if (_error.isNotEmpty)
                Text(_error, style: TextStyle(color: Colors.red)),
              TextField(
                controller: _usernameController,
                decoration: InputDecoration(labelText: 'Username'),
              ),
              TextField(
                controller: _passwordController,
                decoration: InputDecoration(labelText: 'Password'),
                obscureText: true,
              ),
              SizedBox(height: 16),
              ElevatedButton(
                onPressed: _isLoading
                    ? null
                    : () async {
                  setState(() => _isLoading = true);
                  try {
                    final response = await http.post(
                      Uri.parse('http://127.0.0.1:8000/login'),
                      body: jsonEncode({
                        'username': _usernameController.text,
                        'password': _passwordController.text,
                      }),
                      headers: {'Content-Type': 'application/json'},
                    );
                    if (response.statusCode == 200) {
                      // Store token (use shared_preferences for web)
                      Navigator.pushReplacementNamed(context, '/');
                    } else {
                      setState(() => _error = 'Invalid username or password');
                    }
                  } catch (e) {
                    setState(() => _error = 'Login failed');
                  }
                  setState(() => _isLoading = false);
                },
                child: Text(_isLoading ? 'Logging in...' : 'Login'),
              ),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, '/signup'),
                child: Text('New here? Create an account'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}