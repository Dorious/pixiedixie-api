import express from "express";
import app from "./app";

const port = process.env.PIXIE_API_PORT || 8090;

// Run the server
app.listen(port, () => {
  console.log(`Server running @ http://localhost:${port}`);
});