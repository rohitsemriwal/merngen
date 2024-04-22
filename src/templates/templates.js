function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function pluralize(word) {
    if (word.endsWith('y')) {
        return word.slice(0, -1) + 'ies';
    }
    else if (word.endsWith('x') || word.endsWith('h')) {
        return word + 'es';
    }
    else {
        return word + 's';
    }
}


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
import Pagination from "./middlewares/pagination";
import { ApiRouter, WebRouter } from "./routes";

const app = express();
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(ApiResponse());
app.use(Pagination());
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
    interface Request {
        limit: number;
        skip: number;
        page: number;
        perPage: number;
    }

    interface Response {
        success: (data: any, message: string="") => any,
        failure: (message: string="") => any
    }
}`,

featureModel: function(name) {
    return `import { Schema, model } from "mongoose";
    
const ${name}Schema = new Schema({
    // TODO: Add your fields here..

    createdOn: { type: Date },
    updatedOn: { type: Date }
});

${name}Schema.pre('save', function(this: any, next) {
    this.createdOn = new Date();
    this.updatedOn = new Date();
    next();
});

${name}Schema.pre(['updateOne', 'findOneAndUpdate'], function(this: any, next) {
    const update = this.getUpdate();
    delete update._id;

    update.updatedOn = new Date();
    next();
});

const ${capitalizeFirstLetter(name)}Model = model('${capitalizeFirstLetter(name)}', ${name}Schema);
export default ${capitalizeFirstLetter(name)}Model;`;
},

featureController: function(name) {
    const modelFile =  `${name}_model`;
    const modelName = `${capitalizeFirstLetter(name)}Model`;

    return `import ${modelName} from "./../models/${modelFile}";
import { Request, Response } from "express";
import { Types } from "mongoose";
    
const ${capitalizeFirstLetter(name)}Controller = {

    get${capitalizeFirstLetter(pluralize(name))}: async function(req: Request, res: Response) {
        try {
            const ${pluralize(name)} = await ${modelName}.find().skip(req.skip).limit(req.limit);
            return res.success(${pluralize(name)});
        }
        catch(ex: any) {
            return res.failure(ex.toString());
        }
    },

    get${capitalizeFirstLetter(name)}ById: async function(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if(!Types.ObjectId.isValid(id)) throw "Invalid ID";

            const ${name} = await ${modelName}.findById(id);
            return res.success(${name});
        }
        catch(ex: any) {
            return res.failure(ex.toString());
        }
    },

    create${capitalizeFirstLetter(name)}: async function(req: Request, res: Response) {
        try {
            const data = req.body;

            const new${capitalizeFirstLetter(name)} = new ${modelName}(data);
            await new${capitalizeFirstLetter(name)}.save();

            return res.success(new${capitalizeFirstLetter(name)});
        }
        catch(ex: any) {
            return res.failure(ex.toString());
        }
    },

    update${capitalizeFirstLetter(name)}: async function(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if(!Types.ObjectId.isValid(id)) throw "Invalid ID";

            const data = req.body;

            const updated${capitalizeFirstLetter(name)} = await ${modelName}.findByIdAndUpdate(id, data, { new: true });
            if(!updated${capitalizeFirstLetter(name)}) {
                throw "${name} not found";
            }

            return res.success(updated${capitalizeFirstLetter(name)});
        }
        catch(ex: any) {
            return res.failure(ex.toString());
        }
    },

    delete${capitalizeFirstLetter(name)}: async function(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if(!Types.ObjectId.isValid(id)) throw "Invalid ID";

            const deleted${capitalizeFirstLetter(name)} = await ${modelName}.findByIdAndDelete(id);
            if(!deleted${capitalizeFirstLetter(name)}) {
                throw "${name} not found";
            }

            return res.success(deleted${capitalizeFirstLetter(name)});
        }
        catch(ex: any) {
            return res.failure(ex.toString());
        }
    }

};

export default ${capitalizeFirstLetter(name)}Controller;`;
},

featureRouter: function(name) {
    const controllerFile = `${name}_controller`;
    const controllerName = `${capitalizeFirstLetter(name)}Controller`;

    return `import ${controllerName} from "./../controllers/${controllerFile}";
import { Router } from "express";

export default function ${capitalizeFirstLetter(name)}Router() {
    const router = Router();

    router.get("/", ${controllerName}.get${capitalizeFirstLetter(pluralize(name))});
    router.get("/:id", ${controllerName}.get${capitalizeFirstLetter(name)}ById);
    router.post("/", ${controllerName}.create${capitalizeFirstLetter(name)});
    router.put("/:id", ${controllerName}.update${capitalizeFirstLetter(name)});
    router.delete("/:id", ${controllerName}.delete${capitalizeFirstLetter(name)});

    return router;
}`;
},

paginationMiddleware: `import { Request, Response, NextFunction } from "express";

export default function Pagination() {
    return (req: Request, res: Response, next: NextFunction) => {
        req.page = parseInt(req.query.page?.toString() ?? "1");
        req.perPage = parseInt(req.query.perPage?.toString() ?? "100");
        req.limit = req.perPage;
        req.skip = (req.page - 1) * req.perPage;

        next();   
    }
}`

};

export default Templates;