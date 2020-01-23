import app, { config } from "./app";

const port = process.env.PIXIE_API_PORT || config.get("port");
const apiPrefix = config.get("apiPrefix") || '/';

// Run the server
app.listen(port, () => {
  console.log(`Server running @ http://localhost:${port}${apiPrefix}`);
});