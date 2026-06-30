import { connectdb } from "./db/connectdb.js";
import app from "./index.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { intializeSocket } from "./socket.js";
import { log } from "console";

const server = createServer(app);

intializeSocket(server);

log("Server is running line 12");


connectdb().then(()=>{
server.listen(process.env.PORT,()=>{
     log(`Server is running on port ${process.env.PORT}`);
    console.log(`Server is running on port ${process.env.PORT}`);
})


}).catch((err)=>{
    log(err,"server is not running");
} )     
