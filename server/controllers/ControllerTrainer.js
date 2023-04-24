const mysql = require('mysql2');

//Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100, //Maximale Anzahl an aktiven Verbindungen
    host: process.env.DB_HOST, //eine Umgebungsvariable laden (host)
    user: process.env.DB_USER, //eine Umgebungsvariable laden (user)
    password: process.env.DB_PASS, //eine Umgebungsvariable laden (password)
    database: process.env.DB_NAME, //eine Umgebungsvariable laden (database_name)
});

//Ausbilder #######################################################

//alle Ausbilder anzeigen
exports.viewTrainers = (req, res) => { //res als HTTP request (response)
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Use the Connection
        connection.query('SELECT NutzerID,Benutzername,Passwort,Status,Vorname,Nachname,Geburtsdatum,Straße,Hausnummer,Postleitzahl,Wohnort,Email,Telefonnummer,Fachrichtung,Bemerkung FROM nutzer WHERE Status = 1 OR Status = 2', (err, rows) => {//query im alle Daten auszulesen und bei Error eine Fehlerausgabe zu geben
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('trainer', { rows: rows })
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
};


//findUser-Funktion
exports.findTrainer = (req, res) => { //res als HTTP request (response)
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Inputdaten von Search nehmen
        let searchTerm = req.body.find; //search ist der Name unseres Inputfeldes
        //Query um Nach Nachnamen zu filern
        connection.query('SELECT * FROM nutzer WHERE Nachname LIKE ? AND Status = 1 OR Status = 2', ['%' + searchTerm + '%'], (err, rows) => { //Inputfeld übergeben als Jokerposition für die Bedingung
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('trainer', { rows: rows })
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
};

//Rendering /add-trainer
exports.RenderAddTrainer = (req, res) => { //res als HTTP request (response)
    res.render('add-trainer');
};

//Funktion /add-trainer
exports.addTrainer = (req, res) => { //res als HTTP request (response)
    //Inputfelder auslesen und abspeichern
    const { vorname, nachname, gdat, str, hr, plz, ort, email, telefonnummer, fachrichtung, bemerkung, benutzername, passwort, status } = req.body;

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Query um Nach Nachnamen zu filern%' + searchTerm +'%'
        connection.query('INSERT INTO nutzer(Vorname, Nachname, Geburtsdatum, Straße, Hausnummer, Postleitzahl, Wohnort, Email, Telefonnummer, Fachrichtung, Bemerkung, Benutzername, Passwort, Status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [vorname, nachname, gdat, str, hr, plz, ort, email, telefonnummer, fachrichtung, bemerkung, benutzername, passwort, status], (err, rows) => { //Inputfeld übergeben als Jokerposition für die Bedingung
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('add-trainer', { alert: 'Ausbilder erfolgreich hinzugefügt.' });
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
};

//Funktion /edit-trainer welche die Page rendert und die Daten des Datensatzes einfügt
exports.editTrainer = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Query die alle Datensätze mit der ausgewählten ID ermittelt
        connection.query('SELECT * FROM nutzer WHERE NutzerID = ?', [req.params.NutzerID], (err, rows) => {
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('edit-trainer', { rows: rows });
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
}

//Funktion /edit-user welche die neuen Daten in den Datensatz der DB aktualisiert.
exports.editTrainerSubmit = (req, res) => {
    //Die neuen Daten der Inputfelder speichern
    const { vorname, nachname, gdat, str, hr, plz, ort, email, telefonnummer, fachrichtung, bemerkung, benutzername, passwort, status } = req.body;
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Query die alle Datensätze mit der ausgewählten ID ermittelt
        connection.query('UPDATE nutzer SET Vorname = ?, Nachname = ?, Geburtsdatum = ?, Straße = ?, Hausnummer = ?, Postleitzahl = ?, Wohnort = ?, Email = ?, Telefonnummer = ?, Fachrichtung = ?, Bemerkung = ?, Benutzername = ?, Passwort = ?, Status = ? WHERE NutzerID = ?', [vorname, nachname, gdat, str, hr, plz, ort, email, telefonnummer, fachrichtung, bemerkung, benutzername, passwort, status, req.params.NutzerID], (err, rows) => {
            console.log(req.params.NutzerID)
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error

                //UPDATE PAGE WITH THE NEW DATA + ALERT START

                // Connect to DB
                pool.getConnection((err, connection) => {
                    if (err) throw err; //nicht verbunden
                    console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe

                    //Query die alle Datensätze mit der ausgewählten ID ermittelt
                    connection.query('SELECT * FROM nutzer WHERE NutzerID = ?', [req.params.NutzerID], (err, rows) => {
                        //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
                        connection.release();
                        if (!err) { //wenn kein Error
                            res.render('edit-trainer', { rows: rows, alert: 'Ausbilder erfolgreich geändert.' });
                        } else { //wenn Error
                            console.log(err); //ausgabe
                        }
                    });
                });

                //NEW UPDATED PAGE WITH ACTUAL DATA END

            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
}

//Delete-Trainer Funktion
exports.deleteTrainer = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Query die alle Datensätze mit der ausgewählten ID ermittelt
        connection.query('DELETE FROM nutzer WHERE NutzerID = ?', [req.params.NutzerID], (err, rows) => {
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.redirect('/trainer');
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
}


//View-Trainer Funktion
exports.viewTrainer = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe

        //Query die alle Datensätze mit der ausgewählten ID ermittelt
        connection.query('SELECT * FROM nutzer WHERE NutzerID = ?', [req.params.NutzerID], (err, rows) => {
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('view-trainer', { rows: rows });
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
}
