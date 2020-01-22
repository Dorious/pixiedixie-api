import express from "express";

const app = express();
const port = process.env.PIXIE_API_PORT || 8090;

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

// Run the server
app.listen(port, () => {
  console.log(`Server running @ http://localhost:${port}`);
});