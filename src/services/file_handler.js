import fs from "fs";

const FileHandler = {

    createFile: (filePath, data="") => {
        const arr = filePath.split("/");

        let temp = [];
        for(let i=0; i<arr.length; i++) {
            if(i < arr.length - 1) {
                temp.push(arr[i]);
                if(!fs.existsSync(temp.join("/"))) {
                    fs.mkdirSync(temp.join("/"));
                }
            }
            else {
                fs.writeFileSync(filePath, data);
            }
        }
    },

    createDir: (path) => {
        const arr = path.split("/");

        let temp = [];
        for(let i=0; i<arr.length; i++) {
            temp.push(arr[i]);
            if(!fs.existsSync(temp.join("/"))) {
                fs.mkdirSync(temp.join("/"));
            }
        }
    }

};

export default FileHandler;