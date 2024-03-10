// multerConfig.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

class MulterConfig {
    constructor() {
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const publicFolder = path.join(__dirname, 'public');

                let destinationFolder = '';

                // Determine the destination folder based on the field name of the uploaded file
                if (file.fieldname === 'profileImage') {
                    destinationFolder = path.join(publicFolder, 'profiles');
                } else if (file.fieldname === 'productImage') {
                    destinationFolder = path.join(publicFolder, 'products');
                } else if (file.fieldname === 'document') {
                    destinationFolder = path.join(publicFolder, 'documents');
                }

                // Ensure the destination folder exists
                fs.mkdirSync(destinationFolder, { recursive: true });

                cb(null, destinationFolder);
            },
            filename: (req, file, cb) => {
                // Generate a unique filename
                cb(null, Date.now() + path.extname(file.originalname));
            }
        });

        this.upload = multer({ storage: this.storage });
    }

    // Middleware function to handle file uploads
    uploadFiles() {
        return (req, res, next) => {
            this.upload.fields([
                { name: 'profileImage', maxCount: 1 },
                { name: 'productImage', maxCount: 1 },
                { name: 'document', maxCount: 1 }
            ])(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    // Multer error occurred
                    return res.status(400).send('Multer error: ' + err.message);
                } else if (err) {
                    // Other error occurred
                    return res.status(500).send('Error: ' + err.message);
                }
                // Files uploaded successfully
                next();
            });
        };
    }
}

export default MulterConfig;