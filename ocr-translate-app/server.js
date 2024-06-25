const express = require('express');
const Tesseract = require('tesseract.js');
const translate = require('translate-google');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const langdetect = require('langdetect');

const app = express();
const port = 5000;

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// OCR endpoint
app.post('/ocr', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or incorrect field name' });
    }

    const imagePath = req.file.path;

    Tesseract.recognize(imagePath, 'eng+vie') // Sử dụng 'eng+vie' để nhận diện cả tiếng Anh và tiếng Việt
        .then(({ data: { text } }) => {
            fs.unlinkSync(imagePath); // Xóa hình ảnh sau khi xử lý
            const detectedLanguage = langdetect.detectOne(text);
            res.json({ detectedLanguage, text });
        })
        .catch(err => {
            fs.unlinkSync(imagePath);
            res.status(500).json({ error: err.message });
        });
});

// Translate endpoint
app.post('/translate', express.json(), (req, res) => {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
        return res.status(400).json({ error: 'Text and targetLanguage fields are required' });
    }

    translate(text, { to: targetLanguage })
        .then(translation => {
            res.json({ translatedText: translation });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
