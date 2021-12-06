import dotenv from 'dotenv'
dotenv.config({ path: './config/.env' })

const [
    PORT = 8443,
    FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET,
] = process.argv.slice(2);

console.log(process.argv.slice(2))

export{PORT, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET}