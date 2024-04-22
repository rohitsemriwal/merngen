
## RSMERN
Simple MERN Stack template generator written completely in Javascript.

### Quick Links
- [Backend Specific Features](#backend)
- [Frontend Specific Features](#frontend)

### Usage
#### Install the package globally by doing:
```
npm install -g rsmern
```

#### Create a new project by executing:
```
rsmern init <project-name>
```

### <a id="backend"></a>Backend Specific Features
#### Create a new feature by executing:
```
cd <project-name>/backend
rsmern create:feature <featurename>
```
> Example: The command `rsmern create:feature category` will create a CategoryModel in `src/models`, a CategoryController in `src/controllers` and a CategoryRouter in `src/routers`. Note that, it doesn't actually add it to the API Router, you'll have to do that manually by editing the `src/routes.ts` file.

```
// In: src/routes.ts

...
import CategoryRouter from "./routers/category_router";

...
...
    export function ApiRouter() {
        const router = Router();
        
        // Add your router here like this..
        router.use("/category", CategoryRouter());
        ...

        return router;
    }
...
...
```

> NOTE: The `create:feature` command is only meant for the backend. Make sure to change the current directory to backend before proceeding.

#### Other Commands
```
npm run watch => Launches the tsc compiler in watch mode
npm run dev => Launches the development server using Nodemon
```

> It is recommended to open two terminal windows. One for `npm run watch` and another one for `npm run dev` for the best dev experience.

### <a id="frontend"></a>Frontend Specific Features
The frontend is generated using [Vite](https://github.com/vitejs/vite) and has [TailwindCSS](https://tailwindcss.com/) already set up.
\
\
You can start by editing `src/screens/index.jsx`.

> NOTE: Running `npm run build` in the frontend directory will automatically build the static files and place them inside `backend/public` for serving.
