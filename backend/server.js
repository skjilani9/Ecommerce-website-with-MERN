import express from 'express'
import dotenv from 'dotenv'
import database from './config/database.js'
import router from './routes/userroute.js'
import cors from 'cors'
import categoryroute from './routes/categoryroute.js'
import productroute from './routes/productroutes.js'




dotenv.config({ path: "./.env" })


database()


const app = express()







app.use(cors({ credentials: true, origin: true }));
app.use(express.json())




app.use("/api/v1/auth", router)
app.use("/api/v1/category", categoryroute)
app.use("/api/v1/product",productroute)



app.listen(process.env.PORT, () => {
    console.log(`server is connected on ${process.env.PORT}`)
})