const router = require('express').Router(); //Use the Router method provided by Express.js
const ControllerHome = require('../controllers/ControllerHome'); //Pfad zur HOME
const ControllerUser = require('../controllers/ControllerUser'); //Pfad zur CRUD-Teilnehmer
const ControllerTrainer = require('../controllers/ControllerTrainer'); //Pfad zur CRUD-Ausbilder
const ControllerGroup = require('../controllers/ControllerGroup'); //Pfad zur CRUD-Gruppen


//home
router.get('/', ControllerHome.viewHome);

//show all teilnehmer(user)
router.get('/user', ControllerUser.viewUsers); // Call viewHome function for the root URL //user
//search user
router.post('/user', ControllerUser.findUser); // Call findUser function for the root URL
//view user
router.get('/viewuser/:NutzerID', ControllerUser.viewUser); // View-User Funktion Triggerd by View-Button mit verlinkter TeilnehmerID
//add user
router.get('/adduser', ControllerUser.RenderAddUser); //Route (URL) Definition für adduser + Funktionsangabe
router.post('/adduser', ControllerUser.addUser); //Route (URL) Definition für adduser + Funktionsangabe
//edit user
router.get('/edituser/:NutzerID', ControllerUser.editUser); //Route für Edit-User Page mit der Teilnehmer-ID
router.post('/edituser/:NutzerID', ControllerUser.editUserSubmit); //Route für den Submit-Button
//delete user
router.get('/deleteuser/:NutzerID', ControllerUser.deleteUser); // Delete-User Function Triggered by TeilnehmerID der vom Delete-Button übergeben wird


//show all trainer
router.get('/trainer', ControllerTrainer.viewTrainers);
//search trainer
router.post('/trainer', ControllerTrainer.findTrainer);
//view trainer
router.get('/viewtrainer/:NutzerID', ControllerTrainer.viewTrainer)
//add trainer
router.get('/addtrainer', ControllerTrainer.RenderAddTrainer)
router.post('/addtrainer', ControllerTrainer.addTrainer)
//edit trainer
router.get('/edittrainer/:NutzerID', ControllerTrainer.editTrainer);
router.post('/edittrainer/:NutzerID', ControllerTrainer.editTrainerSubmit);
//delete trainer
router.get('/deletetrainer/:NutzerID', ControllerTrainer.deleteTrainer);


//show all groups
router.get('/group', ControllerGroup.viewGroups);
//search groups
router.post('/group', ControllerGroup.findGroup);
//view groups
router.get('/viewgroup/:GruppeID', ControllerGroup.viewGroup);
//add groups
router.get('/addgroup', ControllerGroup.RenderAddGroup);
router.post('/addgroup', ControllerGroup.addGroup);
//edit groups
router.get('/editgroup/:GruppeID', ControllerGroup.editGroup);
router.post('/editgroup/:GruppeID', ControllerGroup.editGroupSubmit);
//delete groups
router.get('/deletegroup/:GruppeID', ControllerGroup.deleteGroup);



//Router-Objekt exportieren um es mit anderen Modulen kommunizieren zu lassen
module.exports = router;