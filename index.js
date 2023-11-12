const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


// middlewares
app.use(cors());
app.use(express.json());

app.get("/" , (req , res) =>  {
    res.send("Bistro boss is running")
})

app.listen(port , () => {
    console.log(`bistro boss in running on port ${port}`)
})