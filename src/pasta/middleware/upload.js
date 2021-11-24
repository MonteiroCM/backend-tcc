const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    novo = __basedir.replace('\src','')
    console.log('novo',novo)
    cb(null, novo + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    const { id } = req.params

    extencao = file.originalname.split('.')
    ext = extencao[extencao.length - 1]
    console.log('filename',__basedir);
    //cb(null, file.originalname);
    cb(null, id+'.'+ext);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
