const { connectDB } = require('./db/db');
const { app } = require('./app');


connectDB()
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(process.env.PORT)
    })
})
.catch((err)=>{
    console.error("Mongo DB connection failed");
})