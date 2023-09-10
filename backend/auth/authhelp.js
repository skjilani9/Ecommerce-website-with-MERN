import bcrypt from 'bcrypt'

export const hashpassword = async(password)=>{
    try {
        const salt = 10
        const hashpass = await bcrypt.hash(password , salt)
        return hashpass
    } catch (error) {
        console.log(error)
    }
}



export const comparepass = async(password,hashpass)=>{
    return bcrypt.compare(password ,hashpass)
}