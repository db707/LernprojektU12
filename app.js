
//require ist eine Funktion um Module in eine Variable laden zu können
const express = require('express'); //Express-Server-Modul 
const exphbs = require('express-handlebars'); //Rendering Engine für Express.js Web-Framework
const bodyParser = require('body-parser'); //Middleware-Modul zum Analysieren eingehender Anforderungstexte in verschiedenen Formaten
const mysql = require('mysql2'); //MySQL Treiber um MySQL Verbindungen aufzubauen

require('dotenv').config(); //Modul um Umgebungsvariablen zu laden

const app = express();//Express-Server initialisieren
const port = process.env.PORT || 5000; //Portzuweisung unter 5000 oder falls genutzt die "enviroment Portnummer" nutzen


//Parsing middleware
//Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Parse application/json
app.use(bodyParser.json());

//Setup Static-Files
app.use(express.static('public')); //static-Funktion bindet die Anwendung an einen Ordner um diese mit Files zu versorgen (CSS-Files,Images,...)

//Setup Templating-Engine (Render-Engine) (Handlebars)
app.engine('handlebars', exphbs.engine()); //exphbs((ext: .nbs))
app.set('view engine', 'handlebars');

//Connection Pool
const pool = mysql.createPool({
    connectionLimit : 100, //Maximale Anzahl an aktiven Verbindungen
    host            : process.env.DB_HOST, //eine Umgebungsvariable laden (host)
    user            : process.env.DB_USER, //eine Umgebungsvariable laden (user)
    password        : process.env.DB_PASS, //eine Umgebungsvariable laden (password)
    database        : process.env.DB_NAME, //eine Umgebungsvariable laden (database_name)
});

// Connect to DB
pool.getConnection((err, connection) => {
    if(err) throw err; //nicht verbunden
    console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
});

//Path-Route definieren wo sich alle Routen befinden
const routes = require('./server/routes/user');
app.use('/', routes)

app.listen(port,()=> console.log(`Listen on port ${port}`));//die App wird dem Port zugwiesen um die Anwendung darüber laufen zulassen inkl. Fehlermeldung/Errorreport