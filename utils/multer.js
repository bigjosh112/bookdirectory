const multer = require('multer');
const path = require('path');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if(ext !== ".pdf" && ext !== ".txt" && ext !== ".word" && ext !== ".docm" && ext !== ".docx" && ext !== ".dot" && ext !== ".dotx"){
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    }
}); 