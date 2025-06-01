import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SignupScreen extends StatefulWidget {
  @override
  _SignupScreenState createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
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
              Text('Create an Account 🚀',
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
              TextField(
                controller: _confirmPasswordController,
                decoration: InputDecoration(labelText: 'Confirm Password'),
                obscureText: true,
              ),
              SizedBox(height: 16),
              ElevatedButton(
                onPressed: _isLoading
                    ? null
                    : () async {
                  if (_passwordController.text != _confirmPasswordController.text) {
                    setState(() => _error = 'Passwords do not match');
                    return;
                  }
                  setState(() => _isLoading = true);
                  try {
                    final response = await http.post(
                      Uri.parse('http://127.0.0.1:8000/register'),
                      body: jsonEncode({
                        'username': _usernameController.text,
                        'password': _passwordController.text,
                      }),
                      headers: {'Content-Type': 'application/json'},
                    );
                    if (response.statusCode == 200) {
                      Navigator.pushReplacementNamed(context, '/login');
                    } else {
                      setState(() => _error = 'Signup failed');
                    }
                  } catch (e) {
                    setState(() => _error = 'Signup failed');
                  }
                  setState(() => _isLoading = false);
                },
                child: Text(_isLoading ? 'Signing Up...' : 'Sign Up'),
              ),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, '/login'),
                child: Text('Already have an account? Log in'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}