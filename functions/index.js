import functions from "firebase-functions"
import express from "express"
import cors from 'cors'
import { login, signup } from "./src/users.js"
import { getShows, addShow } from "./src/shows.js"


const app = express() //create our express app
app.use(cors())
app.use(express.json())

///USER ROUTES

app.post("/signup", signup)
app.post("/login", login)

//SHOWS ROUTES
app.get("/shows", getShows)
app.post("/shows", addShow)

app.listen(3000, () => console.log(`Listening on http://localhost:3000....`))///just if we dont use emulators

export const api = functions.https.onRequest(app) ///export cloud functions