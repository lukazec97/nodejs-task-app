const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DB_PATH, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true,
    useFindAndModify:false
})



