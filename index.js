import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "./src/middleware/auth.js"
import { User } from "./src/models/user.js"
import { loadUsers, saveUsers } from "./src/db/db.js";

const app = express();
app.use(express.json());

app.get('/users/me', auth, async (req, res) => {
    req.send(req.user);
});

app.post('/signup', async (req, res) => {

    try {
        const newUser = new User(req.body);
        const hashedPassword = await bcrypt.hash(newUser.password, 8);
        newUser.password = hashedPassword;
        const users = loadUsers();  // User data
        const duplicateUser = users.filter(function (user) {
            return user.email === req.body.email
        });

        if (duplicateUser.length === 0) {
            users.push(newUser);
            // Generating and adding Auth token to newUser instance
            const token = jwt.sign({ _id: newUser._id.toString() }, 'thisisasecret');
            newUser.tokens = newUser.tokens.concat({ token });

            saveUsers(users);
            res.status(201).send({ status: "User created Successfully!", newUser });
        } else {
            res.status(403).send('User already registered');
        };
    } catch (e) {
        res.status(400).send("Unable to sign up!");
    };
});

app.post('/login', async (req, res) => {
    try {
        // Find user from User data using email and then compare the password
        const { email, password } = User(req.body);
        const users = loadUsers();
        const user = users.find(user => user.email === email);

        // Generating and adding Auth token to user instance
        const token = jwt.sign({ _id: user._id.toString() }, 'thisisasecret');
        user.tokens = user.tokens.concat({ token })
        saveUsers(users)
        // console.log(user.tokens)

        if (!user) {
            throw new Error('Invalid Email. Unable to login!');
        }
        // user found in database... compare password
        const isMatch = await bcrypt.compare(password, user.password);

        // Request's password do not match with any user in database
        if (!isMatch) {
            throw new Error('Wrong Password. Unable to login!');
        };

        res.status(200).send({ user, token });

    } catch (e) {
        res.status(400).send("Invalid Credentials. Please check your email and password.")
    }
});

app.post('/users/logout', auth, async (req, res) => {
})



const port = 3000;
app.listen(port, () => { console.log("Server is now running on port:", port) });