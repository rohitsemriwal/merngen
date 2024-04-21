const Templates = {

    viteConfig: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
    
export default defineConfig({
    build: {
        "outDir": './../backend/public'
    },
    plugins: [react()],
})`,

serverEntry: `import dotenv from "dotenv"; dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import ApiResponse from "./middlewares/response";
import { ApiRouter, WebRouter } from "./routes";

const app = express();
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(ApiResponse());
app.use("/api", ApiRouter());
app.use(WebRouter());

mongoose.connect(process.env.MONGO_URL)
.then(function() {
    console.log("Connected to MongoDB");
})
.catch(function(err) {
    console.log(err.toString());
});

const PORT = process.env.PORT;
app.listen(PORT, function() {
    console.log(\`Server started at PORT: \${PORT}\`);
});`,

backendRoutes: `import { Router } from "express";
import path from "path";

// Handles routes for the API
export function ApiRouter() {
    const router = Router();

    // TODO: Define your routes here..

    return router;
}

// Handles routes for the frontend [DO NOT EDIT]
export function WebRouter() {
    const router = Router();

    router.get("*", function(req, res) {
        const p = path.join(__dirname, "../public/index.html");
        return res.sendFile(p);
    })

    return router;
}`,

dotenv: `PORT = 5000
MONGO_URL = "mongodb://localhost:27017/"`,

mainJsx: `import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexScreen from "./screens/index_screen";
import "./main.css";

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Routes>

            <Route path="/" element={ <IndexScreen /> } />

        </Routes>
    </BrowserRouter>
);`,

indexJsx: `export default function IndexScreen() {
    return(
        <div className="p-5">
            <h1 className="text-3xl font-bold">Welcome to RSMERN</h1>
            <p>If you see this screen, everything's working fine!</p>
        </div>
    );
}`,

tailwindConfig: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,

mainCss: `@tailwind base;
@tailwind components;
@tailwind utilities;`,

gitignoreProject: `.DS_Store`,

gitignoreBackend: `node_modules
dist`,

responseMiddleware: `import { NextFunction, Request, Response } from "express";

function ApiResponse() {
    return (req: Request, res: Response, next: NextFunction) => {
        res.success = function(data, message) {
            return res.status(200).json({ success: true, data: data, message: message });
        }

        res.failure = function(message) {
            return res.status(500).json({ success: false, message: message });
        }

        next();
    }
}

export default ApiResponse;`,

indexDts: `namespace Express {
    interface Response {
        success: (data: any, message: string="") => any,
        failure: (message: string="") => any
    }
}`

};

export default Templates;