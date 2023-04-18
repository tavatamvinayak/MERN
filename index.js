const express = require('express');

const app = express();
const port = 8080

// // db connect 
const DataBaseConnect = require('./DBconnect')
DataBaseConnect();

// // Schemas (model)
const Login = require('./Schemas/Login')

// // encrypt
const CryptoJS = require("crypto-js");

/// // //Json web token
const jwt = require('jsonwebtoken');
const SecreteToken = 'SecreteTokenVinayakTavatam';



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
        const SaveData = await User.save(); // save data in database
        res.json(SaveData)

        /// // /JWT
        const AuthenticationToken = jwt.sign({ Email: SaveData.Email, id: SaveData._id }, SecreteToken); // /// ScreteToken line :18
        console.log(AuthenticationToken + "token")

    } else {
        console.log("this Email is Already Exist")
        res.send("this Email is Already Exist == == Try AnOther Email")
    }

})




    / /// 2st route
    / //// / User can Login 


app.post('/login', async (req, res) => {
  
    // request body login
    const { Email, Password } = req.body

    try {
        /// /// Email checks Exist or Not
        const FindEmail = await Login.findOne({ Email: Email })

        // // Exist or Not Email
        if (FindEmail != null) {  // req.body Email

            /// /// decrypt Password
            const decryptedPassword = CryptoJS.AES.decrypt(FindEmail.Password, 'secret key VinayakTavatam').toString(CryptoJS.enc.Utf8);

            if (decryptedPassword === Password) { //
                console.log("Login success & password is corrected")

                // /// JWt use
                const AuthenticationToken = jwt.sign({ Email: FindEmail.Email, id: FindEmail._id }, SecreteToken); // /// ScreteToken line :18
                res.send("Login success & password is corrected  --  " + AuthenticationToken).status(200)
                console.log(AuthenticationToken)

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


/// /// // get Logined user Details Using  : Post "./getuser"   . Login Required




app.post('/getuser', FetchUser, async (req, res) => {
    try {
        const userId = req.userId; console.log(userId)
        const userdata = await Login.findById(userId)
        console.log(userdata)
        res.send(userdata)
    } catch (error) {
        console.error(error.message)
        res.send("Internal server Error").status(500)
    }
})


/// /// Middleware function
function FetchUser(req, res, next) {
    // get User form JWT token and add id to req Object


    try {
        let Token = req.headers.authorization;
        if (Token) {
            console.log("token accept")
            Token = Token.split(" ")[1]
            const Data = jwt.verify(Token, SecreteToken) // /// ScreteToken line :18
            console.log(Data)
            req.userId = Data.id
            console.log(req.userId)

            next();
        } else {
            console.error(error)
            res.send(" 404").status(404)
        }

    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid Token" })
    }
}


























/// route get check for

app.get('/', (req, res) => {
    console.log("server start server refreshed")
    res.send("creating a server")
})

//// // server start port
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});