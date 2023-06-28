let express = require("express");
let fetch = require("node-fetch");
let ms = require("parse-ms");
let router = express.Router();
let multer  = require('multer')
let upload = multer({ dest: 'uploads/' });
let { millify } = require("millify");


let dbdaily =  require("../../../database/data/economy.js");
let model2 = require("../../../database/models/user.js")
let timeout = 86400000

router.use(require("express-session")({
    secret: process.env.SECRET,
    ...require("../../../json/session.json")
}));

router.get("/", async (request, response) => {
	if (!request.session.bearer_token) {
		response.redirect("/login");
	} else {
        let value = await dbdaily.fech(request.session.user_info);
        response.status(200).render("pages/on/dashboard", {
            user: request.session.user_info,
            db: value, 
            coins: millify(value.coins, {
                units:['', 'K', 'Mi', 'Bi', 'Tri', 'Qua', 'Qui'],
                space: true
            }),
            numbers: {
                e6: !(value.config.e6.blacklist).length ? "<u style=\"color: rgb(255, 40, 40)\">não a tags bloqueadas</u>" : `${(value.config.e6.blacklist).length} tag(s) bloqueada(s)`
            },
            root: "./views/"
        });
	};
});

router.get("/user", async (request, response) => {
    if (!request.session.bearer_token) {
        response.redirect("/login");
    } else {
        response.status(200).render("pages/on/dashboard/redirect_no_image", {
            user: request.session.user_info,
            title: "infelizmente esse local está bloqueado!",
            pagename: "sem acesso",
            link: "/dashboard",
            root: "./views/"
        });
    };
});

router.get("/daily", async (request, response) => {
    if (!request.session.bearer_token) {
        response.redirect("/login");
    } else {
        let user = request.session.user_info;
        let amount = Math.floor(Math.random() * 1000) + 2000;
        
        let value = await dbdaily.fech(user);

        if(value.config.cooldow.daily !== null && timeout - (Date.now() - value.config.cooldow.daily) > 0){
            var time = ms(timeout - (Date.now() - value.config.cooldow.daily));
            let stringTime = `${time.hours} Horas, ${time.minutes} Minutos e ${time.seconds} Segundos`;

            response.status(200).render("pages/on/dashboard/redirect_no_image", {
                user: user,
                title: `volte daqui á ${stringTime}`,
                link: "/dashboard",
                pagename: "daily inválido",
                root: "./views/"
            });
            return {}
        } else {
            let answer = 10;
            let pescaresult = Math.floor(Math.random() * 49) + 1;
            try{
                if(value.config.vip.active == true){
                    answer = pescaresult * pescaresult * (Math.floor(Math.random() * 10) + 1) * 2
                } else {
                    answer = pescaresult * pescaresult * (Math.floor(Math.random() * 10) + 1)
                }
            } catch(err) {
                response.status(200).render("pages/on/dashboard/redirect_no_image", {
                    user: user,
                    title: "não foi possível resgatar seu daily",
                    link: "/dashboard",
                    pagename: "erro",
                    root: "./views/"
                });
            }
            response.status(200).render("pages/on/dashboard/daily", {
                user: user,
                amount: answer,
                link: "/dashboard",
                root: "./views/"
            });
            
            await dbdaily.addmoney(user, answer, true);
        }
    }
});

router.get("/user/edit", async (request, response) => {
	if (!request.session.bearer_token) {
		response.redirect("/login");
	} else {
        response.status(200).render("pages/on/dashboard/profile_edit.ejs", {
            user: request.session.user_info,
            db: await dbdaily.fech(request.session.user_info),
            config: {
                e6: require("../../../json/blackliste6.defaut.json")
            },
            root: "./views/"
        });
    }
});
           
router.post("/user/edit", upload.single('image'), async (request, response) => {
    let data = await model2.findOne({ UserId: request.session.user_info.id });

    data.usertext = request.body['usertext'];
    data.config.e6.blacklist = request.body['tags'];
    
    await data.save().catch(e => console.log(e));

    request.edit_user = true

    //response.redirect("/dashboard/user/edit/success")
    response.status(200).render("pages/on/dashboard/redirect_no_image", {
        user: request.session.user_info,
        title: "dados salvos com sucesso!",
        pagename: "salvo!",
        link: "/dashboard",
        root: "./views/"
    });
});

module.exports = router