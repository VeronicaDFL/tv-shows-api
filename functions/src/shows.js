import { FieldValue } from "firebase-admin/firestore";
import { db } from "./dbConnect.js";

const collection = db.collection("shows");

export async function getShows(req, res) {
    const showsCollection = await collection.get()
    const shows = showsCollection.docs.map(doc =>({...doc.data(), id: doc.id}))
    res.send(shows)
}

export async function addShow(req,res) {
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