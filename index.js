const express = require('express');

// // encrypt
const CryptoJS = require("crypto-js");

const app = express();
const port = 8080



// // db connect 
const DataBaseConnect = require('./DBconnect')
DataBaseConnect();

// // Schemas (model)
const Login = require('./Schemas/Login')

// /// imp pass a data in bodyparser in supported
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 1st router signup
app.post('/signup', async (req, res) => {
    const User = new Login();  // Schema line : 12
    // // request body signup
    const { Fname, Email, Password } = req.body

    User.Fname = Fname;
    User.Email = Email;

    // /// Encrypt password save database  
    //CryptoJS require line :4
    const EncryptPassword = CryptoJS.AES.encrypt(Password, 'secret key VinayakTavatam').toString(); // // password encrypt  
    console.log("🚀 ~ file: index.js:32 ~ app.post ~ EncryptPassword:", EncryptPassword)

    User.Password = EncryptPassword;

    // /// Find a Email Already signup Check ( Already exist Or Not)
    const FindEmail = await Login.findOne({ Email: Email })
    console.log(`Find Email ${FindEmail}`)

    if (!FindEmail) {
        const data = await User.save(); // save data in database
        console.log(data)
        res.json(data)
    } else {
        console.log("this Email is Already Exist")
        res.send("this Email is Already Exist == == Try AnOther Email")
    }

})









/// /// 2st route
/// //// / User can Login 

app.post('/login', async (req, res) => {
    const User = new Login(); // Schema line : 12
    // request body login
    const { Email, Password } = req.body
    User.Email = Email;
    User.Password = Password;

    try {
        /// /// Email checks Exist or Not
        const FindEmail = await Login.findOne({ Email: Email })

        // // Exist or Not Email
        if (FindEmail != null) {  // req.body Email

            /// /// decrypt Password
            const decryptedPassword = CryptoJS.AES.decrypt( FindEmail.Password , 'secret key VinayakTavatam').toString(CryptoJS.enc.Utf8);

            if ( decryptedPassword === Password) { //
                console.log("Login success & password is corrected")
                res.send("Login success & password is corrected").status(200)
            } else {
                console.log("PassWord invalid")
                res.send('PassWord invalid')
            }

        } else {
            console.log("Email invalid ")
            res.send("Email invalid")
        }

    } catch (error) {
        console.log(error)
        res.send(error)
    }

})































// /// route get check for
app.get('/', (req, res) => {
    console.log("server start server refreshed")
    res.send("creating a server")
})

//// // server start port
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});