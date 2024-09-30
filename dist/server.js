"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app")); // Import the app without starting the server
const PORT = process.env.PORT || 5000;
// Start the server (only for actual usage, not tests)
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
