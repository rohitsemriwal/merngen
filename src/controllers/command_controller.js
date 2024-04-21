import { readFileSync, rmSync } from "fs";
import FileHandler from "./../services/file_handler.js";
import { execSync } from "child_process";
import Templates from "./../templates/templates.js";

const CommandController = {

    init: function(projectName) {
        if(!projectName || projectName == "") {
            console.log("Please give a name for the project");
        }

        FileHandler.createDir(`${projectName}`);
        
        // Initializing Frontend
        console.log("Initializing frontend..");
        execSync(`cd ${projectName} && npm create vite@latest frontend -- --template react`, function(err, stdout, stderr) {
            if(err) {
                console.log(err);
                return;
            }
        });

        console.log("Running npm install in frontend..");
        execSync(`cd ${projectName}/frontend && npm install`, function(err, stdout, stderr) {
            if(err) {
                console.log(err);
                return;
            }
        });

        console.log("Installing react router...");
        execSync(`cd ${projectName}/frontend && npm install react-router-dom`, function(err, stdout, stderr) {
            if(err) {
                console.log(err);
                return;
            }
        });


        // Initializing Backend
        console.log("Initializing backend...");
        FileHandler.createDir(`${projectName}/backend`);
        execSync(`cd ${projectName}/backend && npm init -y`, function(err, stdout, stderr) {
            if(err) {
                console.log(err);
                return;
            }
        });

        // Installing packages in backend
        console.log("Installing packages in backend..");

        execSync(`cd ${projectName}/backend && npm install express @types/express body-parser @types/body-parser helmet cors @types/cors mongoose morgan @types/morgan dotenv`, function(err, stdout, stderr) {
            if(err) {
                console.log(err);
                return;
            }
        });

        FileHandler.createFile(`${projectName}/backend/.env`, Templates.dotenv);

        // Installing typescript
        console.log("Setting up typescript...");
        execSync(`cd ${projectName}/backend && npm install -D typescript`, function(err, stdout, stderr) {
            if(err) {
                console.log(err);
                return;
            }
        });
        FileHandler.createFile(`${projectName}/backend/tsconfig.json`, JSON.stringify({
            compilerOptions: {
                target: "ES6",
                rootDir: "./src",
                outDir: "./dist",
                module: "commonjs",
                esModuleInterop: true,                             
                forceConsistentCasingInFileNames: true
            }
        }, null, "\t"));

        // Editing package.json in backend
        console.log("Updating package.json..");
        const buf = readFileSync(`${projectName}/backend/package.json`);
        let data = JSON.parse(buf.toString());
        
        data["main"] = "dist/server.js";
        data["scripts"]["watch"] = "tsc --watch";
        data["scripts"]["start"] = "tsc && node dist/server.js";
        data["scripts"]["dev"] = "tsc && nodemon dist/server.js";

        FileHandler.createFile(`${projectName}/backend/package.json`, JSON.stringify(data, null, "\t"));

        // Creating jsconfig.json in frontend
        FileHandler.createFile(`${projectName}/frontend/jsconfig.json`, JSON.stringify({
            compilerOptions: {
                checkJs: true,
                jsx: "react-jsx"
            }
        }, null, "\t"));

        // Updating vite.config.js
        console.log("Updating vite configuration..");
        FileHandler.createFile(`${projectName}/frontend/vite.config.js`, Templates.viteConfig);

        // Writing some code
        console.log(`💻: Writing some code for you..`);
        FileHandler.createFile(`${projectName}/backend/src/server.ts`, Templates.serverEntry);
        FileHandler.createFile(`${projectName}/backend/src/routes.ts`, Templates.backendRoutes);

        rmSync(`${projectName}/frontend/src`, { recursive: true, force: true });
        FileHandler.createFile(`${projectName}/frontend/src/main.jsx`, Templates.mainJsx);
        FileHandler.createFile(`${projectName}/frontend/src/screens/index_screen.jsx`, Templates.indexJsx);

        // Initializing tailwind
        execSync(`cd ${projectName}/frontend && npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`, function(err, stdout, stderr) {
            if(err) {
                console.log(err);
            }
        });
        FileHandler.createFile(`${projectName}/frontend/tailwind.config.js`, Templates.tailwindConfig);
        FileHandler.createFile(`${projectName}/frontend/src/main.css`, Templates.mainCss);

        // Generate .gitignore files
        FileHandler.createFile(`${projectName}/.gitignore`, Templates.gitignoreProject);
        FileHandler.createFile(`${projectName}/backend/.gitignore`, Templates.gitignoreBackend);


        console.log("Done!");
    }

};

export default CommandController;