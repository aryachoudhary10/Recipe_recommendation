"use client";
import { useState } from "react";
import axios from "axios";

export default function PredictImage() {
  const [image, setImage] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Prediction failed", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white/90 p-6">
      <h1 className="text-3xl font-bold mb-4">🍽️ Predict Food from Image</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleSubmit} className="bg-red-500 text-white px-4 py-2 rounded">
        Predict
      </button>

      {prediction && <p className="mt-4 text-xl font-semibold">Predicted: {prediction}</p>}
    </div>
  );
}
