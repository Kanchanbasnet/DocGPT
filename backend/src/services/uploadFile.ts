import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'


const storage =
    multer.diskStorage({
        destination: (req: Request, file, cb) => {
            const userId = req.body.userId || "default";
            const uploadPath = path.join( `./uploads`, userId)
            fs.mkdirSync(uploadPath, { recursive: true })
            cb(null, uploadPath)

        },
        filename: (req, file, cb) => {
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

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF, DOCX, PPTX, and TXT files are allowed!'));
    }
}

export const upload = multer({
    storage: storage,
    limits: { files: 5 },
    fileFilter: (req, file, cb) => {
        allowedFileType(file, cb);
    }
}).array('files')


