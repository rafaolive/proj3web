if (process.env.NODE_ENV == "production") {
    module.exports = { mongoURI:"mongodb+srv://vanessa_v02:vanessa@cluster0-j3mlj.mongodb.net/test?retryWrites=true&w=majority"}
} else {
    module.exports = { mongoURI: "mongodb://localhost/PROJETO222"}
}