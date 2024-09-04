import React, { useState } from "react";
import axios from "axios";
import "./Disease.css";

const Disease = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleImageChange = (e) => {
    setPredictionResult(null);
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedFile(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const blob = await fetch(selectedFile).then((res) => res.blob());

    const formData = new FormData();
    formData.append("image", blob, "image.png");

    axios
      .post("http://127.0.0.1:5000/predict", formData, config)
      .then((response) => {
        console.log(response);
        console.log("Prediction result:", response.data);
        setPredictionResult(response.data.class);
      })
      .catch((error) => {
        console.error("Error making prediction:", error);
      });
  };

  return (
    <div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="imageInput">Select Image:</label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageChange}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <hr />

      {predictionResult && (
        <>
          <h1>RESULT.</h1>
          <div className="container">
            {selectedFile && (
              <div className="image-container">
                <p>Selected Image:</p>
                <img
                  src={selectedFile}
                  alt="Selected"
                  style={{ maxWidth: "100%" }}
                />
              </div>
            )}
            <div className="result-container">
              <h2>Prediction:</h2>
              <p
                style={{
                  color: `${
                    predictionResult === "NORMAL"
                      ? "green"
                      : predictionResult === "PNEUMONIA"
                      ? "red"
                      : "black"
                  }`,
                }}
              >
                {predictionResult === "NORMAL"
                  ? "Person is Normal"
                  : predictionResult === "PNEUMONIA"
                  ? "Person is suffering from PNEUMONIA"
                  : "Unknown condition"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Disease;
