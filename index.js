if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

let express = require('express');
let app = express();
let colors = require("colors");
let config = require("./config.json");
let port =  require("./funcions/port.js")(process.env.PORT || 3000);

let useragent = require('express-useragent');

app.set("view engine", "ejs");
app.use(express.static("./views"));

app.use(express.json());
app.use(useragent.express());
app.use(express.urlencoded());

app.use("/", require("./routers/oauth/index.js"));
app.use("/", require("./routers/controller/renderPage.js"));
app.use("/", require("./routers/controller/redirectPage.js"));
app.use("/dashboard", require("./routers/oauth/config/dashboard.js"));
app.use("/store", require("./routers/oauth/config/store.js"));

app.get('/pingsend', (req, res, next) => {
    res.sendStatus(200);
    //console.log("a");
});

app.get('/404', (req, res, next) => {
    next();
});

app.use(function(req, res, next){
    res.status(404);
    
    res.format({
        html: function () {
            res.render("pages/on/dashboard/redirect_image", {
                erro_code: 404,
                root: "./views/"
            });
        },
        json: function () {
            res.json({
                sucess: false,
                status: 404,
                route: req.url
            });
    	},
        default: function () {
            res.send("not found");
        }
    });
});

app.listen(port, () => {
    console.log(colors.green(`[SERVER] - Servidor Iniciado com Sucesso na Porta ${port}`));
});

require("./database/index.js")();