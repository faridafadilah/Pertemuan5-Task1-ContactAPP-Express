const express = require("express"); // Module Express
const expressLayouts = require("express-ejs-layouts"); // Module Layout EJS
const loadContact = require('./utils/contacts'); // Local Module

const app = express();
const port = 3000; //Port Server

// Templating Engine | Layout Page
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static('public')); // Middleware untuk public(img,css)

// Url & Menampilkan FIle index.html
app.get("/", (req, res) => {
  res.render("index", {
    nama: 'Farida',
    title: 'Halaman Index',
    layout: 'layouts/main-layouts'
  });
});

// Url /About & Menampilkan File about.html
app.get("/about", (req, res) => {
  res.render("about", { 
    nama: 'Farida Fadilah',
    deskripsi: 'Programmer | Doctor',
    title: 'Halaman About',
    layout: 'layouts/main-layouts' 
  });
});

// Url /contact & Menampilkan File Contact.html
app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", {
    title: 'Halaman Contact',
    layout: 'layouts/main-layouts',
    contacts,
  });
});

// Url /contact
app.get("/contact/:id", (req, res) => {
  // Mengambil parameter id dan query Category
  res.send(
    `Product Id:  ${req.params.id} <br> Category ID: ${req.query.category}`
  );
});

// Url selain diatas
app.use("/", (req, res) => {
  res.status(404);
  res.send("Not Found: 404");
});

// Membuat Server
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});