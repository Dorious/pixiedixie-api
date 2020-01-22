import express from "express";

const app = express();

/**
 * Let's use root as API Documentation.
 */
app.get("/", (req, res) => {
  res.send(
    {
      documentation: {
        overview: "Basic calls for Pixie & Dixie GIFs",
        handlers: {
          "/datasources": { },
          "/images": { },
          "/search": { }
        }
      }
    }
  );
});

// Get all datasources info
app.get("/datasources", (req, res) => {
  res.send(
    {
      data: {}
    }
  );
});

// Search for images
app.get("/images", (req, res) => {
  res.send(
    {
      data: {}
    }
  );
});

// Search for images
app.get("/search", (req, res) => {
  res.send(
    {
      data: {}
    }
  );
});

export default app;