let mongoose = require("mongoose");
const colors = require("colors");

module.exports = () => {
    mongoose.connect(process.env.MONGOOSE, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    //mongoose.set('strictQuery', true);
    
    mongoose.connection.on('connected', function() {
        console.log(colors.yellow(`[DATABASE] - Firebase Realtime Database foi Conectado com Sucesso!`));
    });
} 