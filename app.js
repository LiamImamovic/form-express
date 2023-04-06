const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Configuration de la connexion à la base de données
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'my-form',
  port: 8889
});

// Ajoute mon css
app.get('/style.css', function(req, res) {
  res.type('text/css');
  res.sendFile(__dirname + '/style.css');
});

// Route pour afficher le formulaire
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route pour ajouter un utilisateur à la base de données
app.post('/ajouterUtilisateur', (req, res) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.email;

  pool.query(
    'INSERT INTO utilisateurs (nom, prenom, email) VALUES (?, ?, ?)',
    [nom, prenom, email],
    (error, results) => {
      if (error) {
        console.error(error);
        res.send('Erreur lors de l\'enregistrement des données');
      } else {
        res.send(`
        <html>
        <head>
          <title>Récapitulatif</title>
          <style>
            body {
              text-align: center;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: rgb(41, 41, 41);
              color: white;
            }
            p {
              font-size: 1.2em;
              margin-bottom: 10px;
            }

          </style>
          </head>
          <body>
            <h1>Récapitulatif</h1>
            <p>Nom : ${nom}</p>
            <p>Prénom : ${prenom}</p>
            <p>Email : ${email}</p>
          </body>
        </html>
        `);
      }
    }
  );
});

// Démarrage du serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
