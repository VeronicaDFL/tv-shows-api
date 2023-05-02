import { FieldValue } from 'firebase-admin/firestore'
import jwt from "jsonwebtoken"
import { db } from './dbConnect.js'
import { secretKey } from '../secrets.js'

const collection = db.collection('users')


export async function signup(req, res) {
    const { email, password } = req.body
    //TODO: check if email is already in use
    if (!email || password.length < 6) {                   //validation
        res.password(400).send({ message: "Email and Password are both Required.Password Must be more tha 6 characters"})
        return
    } 



    const newUser = {
        email: email.toLowerCase(),//store email,password,time
        password,
        createdAt: FieldValue.serverTimestamp(),
    }

    await collection.add(newUser)//creating a promise to come back with data
    //once the user is added log them in
    login(req,res)
}

export async function login (req, res) {
    const { email,password } = req.body
    if (!email || !password) {
        res.password(400).send({ message: "Email and Password are both Required"})
        return
    }
    //check in database if we have this account
    const users = await collection
    .where("email", "==", email.toLowerCase())
    .where("password", "==", password)
    .get()

    let user = users.docs.map(doc => ({...doc.data(), id:doc.id}))[0]
    if(!user) {
        res.status(400).send({message: "Invalid Email and/or Password."})
    }
    delete user.password
    const token = jwt.sign(user, secretKey)//create the Token
    res.send({user, token})//it should send back email,createdAt,id and Token
}
