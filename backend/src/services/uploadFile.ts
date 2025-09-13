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
    const allowedExtensions = /pdf|docx|pptx|txt/; 
    const allowedMimeTypes = [
        'application/pdf',                                                               
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',     
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
        'text/plain'                                                                     
    ];

    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.includes(file.mimetype);
    
    console.log("File type:::", file.mimetype);
    console.log("Ext name::::", path.extname(file.originalname).toLowerCase());
    console.log("Extension valid:", extname);
    console.log("MIME type valid:", mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF, DOCX, PPTX, and TXT files are allowed!'));
    }
}

export const upload = multer({
    storage: storage,
    limits: {  files: 5 },
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
