

export const TICKET_SECRET_KEY = "secretKey";


export const ChatConfigLoader = () => ({
    secretKey: process.env.CHAT_TICKET_SECRET_KEY
})


