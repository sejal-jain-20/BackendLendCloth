import multer from "multer";

const storage = multer.memoryStorage();
const multipleUpload = multer({ storage }).array("files", 4); // "files" is the field name for file array, and 5 is the maximum number of files allowed

export default multipleUpload;