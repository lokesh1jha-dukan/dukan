"use client";
import React, { useState } from "react";
import { Button } from "./button";

interface Props {
  onUpload: (url: string) => void;
}

const SingleFileUploader: React.FC<Props> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"initial" | "uploading" | "success" | "fail">("initial");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        setStatus("initial");
        setFile(selectedFile);
        setErrorMessage("");
      } else {
        setFile(null);
        setErrorMessage("Please select a image file.");
      }
    }
  };

  const handleUpload = async () => {
    if (file) {
      setStatus("uploading");

      const formData = new FormData();
      formData.append("file", file);

      try {
        // TODO: Upload image and return the UUID to parent
        const result = await fetch("https://httpbin.org/post", {
          method: "POST",
          body: formData,
        });

        const data = await result.json();

        console.log(data);
        setStatus("success");
        onUpload(data.url); // Pass uploaded UUID to parent component
      } catch (error) {
        console.error(error);
        setStatus("fail");
      }
    }
  };

  return (
    <>
      <input type="file" onChange={handleFileChange} />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {file && (
        <section>
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )}

      {file && (
        <Button
        color="primary" className="mt-4"
          onClick={handleUpload}
        >
          Upload Image
        </Button>
      )}

      <Result status={status} />
      <br />
    </>
  );
};

interface ResultProps {
  status: "initial" | "uploading" | "success" | "fail";
}

const Result: React.FC<ResultProps> = ({ status }) => {
  if (status === "success") {
    return <p>✅ Image uploaded successfully!</p>;
  } else if (status === "fail") {
    return <p>❌ Image upload failed!</p>;
  } else if (status === "uploading") {
    return <p>⏳ Uploading Image...</p>;
  } else {
    return null;
  }
};

export default SingleFileUploader;
