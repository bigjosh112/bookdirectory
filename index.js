const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const app = express();


// init mongoose
mongoose.connect(process.env.MONGO_URI);

const con = mongoose.connection;
con.on('open', error => {
    if(!error){
        console.log('DB connection successful');
    }else{
        console.log(`DB connection failed with error: ${error}`);
    }
});

app.use(express.json());

 app.use('/user', require('./routes/user'));
 app.use('/book', require('./routes/book'));
 app.use('/review', require('./routes/review'));
 app.use('/likes', require('./routes/likes'));
 app.use('/dislikes', require('./routes/dislikes'));
 app.use('/search', require('./routes/search'));
 //app.use('/download', require('./routes/download'));


const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))