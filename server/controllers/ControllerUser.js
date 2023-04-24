const mysql = require('mysql2');

//Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100, //Maximale Anzahl an aktiven Verbindungen
    host: process.env.DB_HOST, //eine Umgebungsvariable laden (host)
    user: process.env.DB_USER, //eine Umgebungsvariable laden (user)
    password: process.env.DB_PASS, //eine Umgebungsvariable laden (password)
    database: process.env.DB_NAME, //eine Umgebungsvariable laden (database_name)
});


//Teilnehmer #######################################################

//viewUser-Funktion
exports.viewUsers = (req, res) => { //res als HTTP request (response)
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Use the Connection
        connection.query('SELECT NutzerID,Benutzername,Passwort,Vorname,Nachname,Geburtsdatum,Straße,Hausnummer,Postleitzahl,Wohnort,Email,Telefonnummer, GruppeID,Fachrichtung,Schulungshistorie FROM nutzer WHERE Status = 3', (err, rows) => {//query im alle Daten auszulesen und bei Error eine Fehlerausgabe zu geben
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('user', { rows: rows })
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
};


//findUser-Funktion
exports.findUser = (req, res) => { //res als HTTP request (response)
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Inputdaten von Search nehmen
        let searchTerm = req.body.find; //search ist der Name unseres Inputfeldes
        //Query um Nach Nachnamen zu filern
        connection.query('SELECT NutzerID,Benutzername,Passwort,Vorname,Nachname,Geburtsdatum,Straße,Hausnummer,Postleitzahl,Wohnort,Email,Telefonnummer, GruppeID,Fachrichtung,Schulungshistorie FROM nutzer WHERE Nachname LIKE ? AND Status = 3', ['%' + searchTerm + '%'], (err, rows) => { //Inputfeld übergeben als Jokerposition für die Bedingung
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('user', { rows: rows })
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
};

//Rendering /add-user
exports.RenderAddUser = (req, res) => { //res als HTTP request (response)
    res.render('add-user');
};

//Funktion /add-user
exports.addUser = (req, res) => { //res als HTTP request (response)
    //Inputfelder auslesen und abspeichern
    const { vorname, nachname, gdat, str, hr, plz, ort, email, telefonnummer, gruppe, fachrichtung, schulung, benutzername, passwort } = req.body;
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Query um Nach Nachnamen zu filern%' + searchTerm +'%'
        connection.query('INSERT INTO nutzer(Vorname, Nachname, Geburtsdatum, Straße, Hausnummer, Postleitzahl, Wohnort, Email, Telefonnummer, GruppeID, Fachrichtung, Schulungshistorie, Benutzername, Passwort, Status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,3)', [vorname, nachname, gdat, str, hr, plz, ort, email, telefonnummer, gruppe, fachrichtung, schulung, benutzername, passwort], (err, rows) => { //Inputfeld übergeben als Jokerposition für die Bedingung
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('add-user', { alert: 'Teilnehmer erfolgreich hinzugefügt.' });
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
};

//Funktion /edit-user welche die Page rendert und die Daten des Datensatzes einfügt
exports.editUser = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Query die alle Daten mit der ausgewählten ID ermittelt
        connection.query('SELECT * FROM nutzer WHERE NutzerID = ?', [req.params.NutzerID], (err, rows) => {
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('edit-user', { rows: rows });
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
}

//Funktion /edit-user welche die neuen Daten in den Datensatz der DB aktualisiert.
exports.editUserSubmit = (req, res) => {
    //Die neuen Daten der Inputfelder speichern
    const { vorname, nachname, gdat, str, hr, plz, ort, email, telefonnummer, gruppe, fachrichtung, schulung, benutzername, passwort } = req.body;
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe

        //Query die alle Datensätze mit der ausgewählten ID ermittelt
        connection.query('UPDATE nutzer SET Vorname = ?, Nachname = ?, Geburtsdatum = ?, Straße = ?, Hausnummer = ?, Postleitzahl = ?, Wohnort = ?, Email = ?, Telefonnummer = ?, GruppeID = ?, Fachrichtung = ?, Schulungshistorie = ?, Benutzername = ?, Passwort = ? WHERE NutzerID = ?', [vorname, nachname, gdat, str, hr, plz, ort, email, telefonnummer, gruppe, fachrichtung, schulung,benutzername, passwort, req.params.NutzerID], (err, rows) => {
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
                            res.render('edit-user', { rows: rows, alert: 'Teilnehmer erfolgreich geändert.' });
                        } else { //wenn Error
                            console.log(err); //ausgabe
                        }
                        console.log('the data: \n', rows)
                    });
                });

                //NEW UPDATED PAGE WITH ACTUAL DATA END

            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
}

//Delete-User Funktion
exports.deleteUser = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Query die alle Datensätze mit der ausgewählten ID ermittelt
        connection.query('DELETE FROM nutzer WHERE NutzerID = ?', [req.params.NutzerID], (err, rows) => {
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.redirect('/user');
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
}


//View-User Funktion
exports.viewUser = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe

        //Query die alle Datensätze mit der ausgewählten ID ermittelt
        connection.query('SELECT * FROM nutzer WHERE NutzerID = ?', [req.params.NutzerID], (err, rows) => {
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('view-user', { rows: rows });
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
}
