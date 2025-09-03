import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

function allowedFileType(file: any, cb: any) {
    const filetypes = /pdf|docx|ppt|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Files only! (pdf, docx, ppt, txt)');
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000, files: 5 },
    fileFilter: function (req, file, cb) {
        allowedFileType(file, cb);
    }
}).array('files')

export const fileUpload = (req: Request, res: Response) => {
    upload(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message })
        } else if (err) {
            return res.status(400).json({ error: err.message || err })
        }
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            return res.status(400).json({ error: 'No files uploaded!' });
        }

        return res.status(200).json({
            message: 'Files uploaded successfully!',
            files: req.files,
        });
    })
}
