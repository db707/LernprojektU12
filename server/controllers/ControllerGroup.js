const mysql = require('mysql2');

//Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100, //Maximale Anzahl an aktiven Verbindungen
    host: process.env.DB_HOST, //eine Umgebungsvariable laden (host)
    user: process.env.DB_USER, //eine Umgebungsvariable laden (user)
    password: process.env.DB_PASS, //eine Umgebungsvariable laden (password)
    database: process.env.DB_NAME, //eine Umgebungsvariable laden (database_name)
});


//Gruppen #######################################################

//alle Gruppen anzeigen
exports.viewGroups = (req, res) => { //res als HTTP request (response)
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Use the Connection
        connection.query('SELECT * FROM gruppe;', (err, rows) => {//query im alle Daten auszulesen und bei Error eine Fehlerausgabe zu geben
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('group', { rows: rows })
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
};


//findGroup-Funktion
exports.findGroup = (req, res) => { //res als HTTP request (response)
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Inputdaten von Search nehmen
        let searchTerm = req.body.find; //search ist der Name unseres Inputfeldes
        //Query um Nach Nachnamen zu filern
        connection.query('SELECT * FROM gruppe WHERE Bezeichnung LIKE ?', ['%' + searchTerm + '%'], (err, rows) => { //Inputfeld übergeben als Jokerposition für die Bedingung
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('group', { rows: rows })
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
};

//Rendering /add-group
exports.RenderAddGroup = (req, res) => { //res als HTTP request (response)
    res.render('add-group');
};

//Funktion /add-group
exports.addGroup = (req, res) => { //res als HTTP request (response)
    //Inputfelder auslesen und abspeichern
    const { gruppeid, bezeichnung, bemerkung } = req.body;

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Query um Nach Nachnamen zu filern%' + searchTerm +'%'
        connection.query('INSERT INTO gruppe(GruppeID, Bezeichnung, Bemerkung) VALUES (?,?,?)', [gruppeid, bezeichnung, bemerkung], (err, rows) => { //Inputfeld übergeben als Jokerposition für die Bedingung
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('add-group', { alert: 'Gruppe erfolgreich hinzugefügt.' });
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
};

//Funktion /edit-group welche die Page rendert und die Daten des Datensatzes einfügt
exports.editGroup = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe

        //Query die alle Datensätze mit der ausgewählten ID ermittelt
        connection.query('SELECT * FROM gruppe WHERE GruppeID = ?', [req.params.GruppeID], (err, rows) => {
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.render('edit-group', { rows: rows });
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
}

//Funktion /edit-group welche die neuen Daten in den Datensatz der DB aktualisiert.
exports.editGroupSubmit = (req, res) => {
    //Die neuen Daten der Inputfelder speichern
    const { bezeichnung, bemerkung } = req.body;
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe

        //Query die alle Datensätze mit der ausgewählten ID ermittelt
        connection.query('UPDATE gruppe SET Bezeichnung = ?, Bemerkung = ? WHERE GruppeID = ?', [bezeichnung, bemerkung, req.params.GruppeID], (err, rows) => {

            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error

                //UPDATE PAGE WITH THE NEW DATA + ALERT START

                // Connect to DB
                pool.getConnection((err, connection) => {
                    if (err) throw err; //nicht verbunden
                    console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
                    //Query die alle Datensätze mit der ausgewählten ID ermittelt
                    connection.query('SELECT * FROM gruppe WHERE GruppeID = ?', [req.params.GruppeID], (err, rows) => {
                        //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
                        connection.release();
                        if (!err) { //wenn kein Error
                            res.render('edit-group', { rows: rows, alert: 'Gruppe erfolgreich geändert.' });
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

//Delete-Gruppe Funktion
exports.deleteGroup = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        //Query die alle Datensätze mit der ausgewählten ID ermittelt
        connection.query('DELETE FROM gruppe WHERE GruppeID = ?', [req.params.GruppeID], (err, rows) => {
            //Wenn die Aktivät der Verbindung abgeschlossen dann schließen
            connection.release();
            if (!err) { //wenn kein Error
                res.redirect('/group');
            } else { //wenn Error
                console.log(err); //ausgabe
            }
        });
    });
}


//View-Gruppe Funktion
exports.viewGroup = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //nicht verbunden
        console.log('Connected as ID ' + connection.threadId); //erfolgreich Verbunden + ThreadID Ausgabe
        // Query database for group information
        connection.query('SELECT Bezeichnung, GruppeID, Bemerkung FROM gruppe WHERE GruppeID = ?', [req.params.GruppeID], (err, groupData) => {
            if (err) throw err;

            // Query database for member information
            connection.query('SELECT Vorname, Nachname, Fachrichtung FROM nutzer WHERE GruppeID = ?', [req.params.GruppeID], (err, memberData) => {
                if (err) throw err;
                // Create separate variables for each set of data
                const groupInfo = {
                    Bezeichnung: groupData[0].Bezeichnung,
                    GruppeID: groupData[0].GruppeID,
                    Bemerkung: groupData[0].Bemerkung
                };
                const memberInfo = memberData;
                connection.release();
                console.log(groupInfo, memberInfo);
                // Render the template with each set of data
                res.render('view-group', {
                    groupInfo: groupInfo,
                    memberInfo: memberInfo
                });
            });
        });
    }
    )
};