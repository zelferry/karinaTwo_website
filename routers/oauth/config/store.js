let express = require("express");
let router = express.Router();
let fetch = require("node-fetch");

let dbdaily =  require("../../../database/data/economy.js");
let model2 = require("../../../database/models/user.js");

router.get("/", async (request, response) => {
	if (!request.session.bearer_token) {
		response.redirect("/login");
	} else {
        response.status(200).render("pages/on/dashboard/store.ejs", {
            user: request.session.user_info,
            db: await dbdaily.fech(request.session.user_info),
            root: "./views/"
        });
    }
});

module.exports = router