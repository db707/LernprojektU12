const mysql = require('mysql2');

//Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100, //Maximale Anzahl an aktiven Verbindungen
    host: process.env.DB_HOST, //eine Umgebungsvariable laden (host)
    user: process.env.DB_USER, //eine Umgebungsvariable laden (user)
    password: process.env.DB_PASS, //eine Umgebungsvariable laden (password)
    database: process.env.DB_NAME, //eine Umgebungsvariable laden (database_name)
});

//HOME
exports.viewHome = (req, res) => { //res als HTTP request (response)
    res.render('home');
};

//sessioon
//status
//route