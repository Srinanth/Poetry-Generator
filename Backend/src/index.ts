import app from "./app.js";
import connectToDatabase from "./db/connect.js";

const PORT = process.env.PORT || 3000;


//connections and listeners
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log("Server Open and Connected to Database");
    });
}).catch(err=>console.log(err));

