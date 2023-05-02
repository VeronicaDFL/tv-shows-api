import { FieldValue } from "firebase-admin/firestore";
import  jwt  from "jsonwebtoken";
import { db } from "./dbConnect.js";
import { secretKey } from "../secrets.js";

const collection = db.collection("shows");

export async function getShows(req, res) {
    const showsCollection = await collection.get()
    const shows = showsCollection.docs.map(doc =>({...doc.data(), id: doc.id}))
    res.send(shows)
}

export async function addShow(req,res) {
    const token = req.headers.authorization//request authentication in order to add a show
    if(!token) {
        res.status(401).send({message: "Unauthorized. A valid Token is required."})
        return
    }
    if(!decoded) {
        const decoded =jwt.verify(token,secretKey) //verify token
        res.status(401).send({message: "A valid Token is required."})
        return
    }
    const { title, poster, season } = req.body
    if(!title || !poster || !season) {
        res.status(400).send({message: " Show Title,Poster,Season is Required."})
        return
    }
    const newShow = {
        title,
        poster,
        season,
        createdAt: FieldValue.serverTimestamp(),
    }
    await collection.add(newShow)//add thye new show
    getShows(req,res)//return updated list
}