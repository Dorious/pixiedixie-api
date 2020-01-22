"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const port = process.env.PIXIE_API_PORT || 8090;
/**
 * Let's use root as API Documentation.
 */
app.get("/", (req, res) => {
    res.send({
        documentation: {
            overview: "Basic calls for Pixie & Dixie GIFs",
            handlers: {
                "/datasources": {},
                "/images": {},
                "/search": {}
            }
        }
    });
});
// Get all datasources info
app.get("/datasources", (req, res) => {
    res.send({
        data: {}
    });
});
// Search for images
app.get("/images", (req, res) => {
    res.send({
        data: {}
    });
});
// Search for images
app.get("/search", (req, res) => {
    res.send({
        data: {}
    });
});
// Run the server
app.listen(port, () => {
    console.log(`Server running @ http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map