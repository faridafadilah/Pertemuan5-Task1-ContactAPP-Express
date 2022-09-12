const express = require("express"); // Module Express
const expressLayouts = require("express-ejs-layouts"); // Module Layout EJS
const { body, validationResult, check } = require('express-validator'); // Express Validator
const { 
  loadContact, 
  findContact, 
  addContact, 
  cekDuplikat, 
  deleteContact, 
  updateContact 
}= require('./utils/contacts'); // Local Module

const app = express();
const port = 3000; //Port Server

// Templating Engine | Layout Page
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static('public')); // Middleware untuk public(img,css)
app.use(express.urlencoded({ extended: true })); // Untuk parsing body request

// Url & Menampilkan FIle index.html
app.get('/', (req, res) => {
  res.render('index', {
    nama: 'Farida',
    title: 'Halaman Index',
    layout: 'layouts/main-layouts'
  });
});

// Url /About & Menampilkan File about.html
app.get('/about', (req, res) => {
  res.render('about', { 
    nama: 'Farida Fadilah',
    deskripsi: 'Programmer | Doctor',
    title: 'Halaman About',
    layout: 'layouts/main-layouts' 
  });
});

// Url /contact & Menampilkan File Contact.html
app.get('/contact', (req, res) => {
  const contacts = loadContact();
  res.render('contact', {
    title: 'Halaman Contact',
    layout: 'layouts/main-layouts',
    contacts,
  });
});

// Menambah Data Contact
app.get('/contact/add', (req, res) => {
  res.render('create', {
    title: 'Halaman Tambah Data',
    layout: 'layouts/main-layouts'
  });
});

// Proses Menyimpan Data Contact
app.post('/contact', [
  body('nama').custom(value => {
      const duplikat = cekDuplikat(value);
      if(duplikat) {
        throw Error('Maaf, Contact yang anda masukan sudah tersedia.');
      }
      return true;
    }),
  check('email', 'Email tidak Valid').isEmail(),
  check('nohp', 'No Hp tidak Valid').isMobilePhone('id-ID') ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('create', {
        title: 'Halaman Tambah Data',
        layout: 'layouts/main-layouts',
        errors: errors.array()
      });
    } else {
      addContact(req.body);
      res.redirect('/contact');
    }
});

// Menghapus Data Contact
app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  if(!contact) {
    return res.send('Maaf Nama Contact tidak Ada!');
  }
  deleteContact(req.params.nama);
  res.redirect('/contact');
});

// Mengedit Data
app.get('/contact/edit/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  res.render('edit', {
    title: 'Halaman Edit Data',
    layout: 'layouts/main-layouts',
    contact
  });
});

//proses Mengubah Data contact
app.post('/contact/update', [
  body('nama').custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
          throw new Error('Nama sudah terdaftar!');
      }
      return true;
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('nohp', 'No HP tidak Valid!').isMobilePhone('id-ID')
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('edit', {
            title: "ExpressJS",
            layout: "layouts/main-layouts",
            errors: errors.array(),
            contact: req.body,
        });
    } else{
        updateContact(req.body);
        res.redirect('/contact');
    }
});


// Detail Contact Berdasarkan Nama
app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  res.render('detail', {
    title: 'Halaman Edit Data',
    layout: 'layouts/main-layouts',
    contact
  });
});

// Url selain diatas
app.use('/', (req, res) => {
  res.status(404);
  res.send("Not Found: 404");
});

// Membuat Server
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});