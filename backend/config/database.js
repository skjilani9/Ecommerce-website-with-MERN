import mongoose from 'mongoose'


const database = async()=>{
    try {
        const conn = await mongoose.connect("mongodb+srv://ecom:ecom@cluster0.j8jqsnj.mongodb.net/")
        console.log(`server is connected on ${conn.connection.host}`);
    } catch (error) {
        console.log(error)
    }
}

export default database