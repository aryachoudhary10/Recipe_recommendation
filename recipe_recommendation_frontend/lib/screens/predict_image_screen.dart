import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;

class PredictImageScreen extends StatefulWidget {
  @override
  _PredictImageScreenState createState() => _PredictImageScreenState();
}

class _PredictImageScreenState extends State<PredictImageScreen> {
  String _prediction = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('🍽️ Predict Food from Image',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            ElevatedButton(
              onPressed: () async {
                FilePickerResult? result = await FilePicker.platform.pickFiles(
                  type: FileType.image,
                );
                if (result != null) {
                  var request = http.MultipartRequest(
                    'POST',
                    Uri.parse('http://127.0.0.1:8000/predict'),
                  );
                  request.files.add(
                    http.MultipartFile.fromBytes(
                      'image',
                      result.files.single.bytes!,
                      filename: result.files.single.name,
                    ),
                  );
                  final response = await request.send();
                  if (response.statusCode == 200) {
                    final respStr = await response.stream.bytesToString();
                    setState(() => _prediction = jsonDecode(respStr)['prediction']);
                  } else {
                    setState(() => _prediction = 'Prediction failed');
                  }
                }
              },
              child: Text('Select Image'),
            ),
            if (_prediction.isNotEmpty) Text('Predicted: $_prediction'),
          ],
        ),
      ),
    );
  }
}