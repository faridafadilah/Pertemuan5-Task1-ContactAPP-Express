const fs = require('fs');

// Cek Folder Data
const dirPath = './data';
if(!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// Cek FIle contact.json
const filePath = './data/contact.json';
if(!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', 'utf-8');
}

// Membaca Data
const loadContact = () => {
    const file = fs.readFileSync(filePath, 'utf-8'); // Membaca file
    const contacts = JSON.parse(file); // Mengubah data ke JSON
    return contacts;
}

module.exports = loadContact;