import mongoose from "mongoose"
///replace localhost with ENVIRONMENT VARIABLE
mongoose.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})