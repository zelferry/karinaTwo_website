const express = require("express");
const router = express.Router();

router.get("/add", (request, response) => {
    response.redirect("https://discord.com/api/oauth2/authorize?client_id="+process.env.CLIENT_ID+"&scope=bot+applications.commands&permissions=550360165470");
});

router.get("/support", (request, response) => {
    response.redirect("https://discord.gg/Xmu7HrH3yy");
});

router.get("/twitter", (request, response) => {
    response.redirect("https://twitter.com/zelferry?t=lqQVL8zd9eQWlRPb5TzPSw&s=09");
});

router.get("/github", (request, response) => {
    response.redirect("https://github.com/zelferry");
});

router.get("/upvote", (request, response) => {
	response.redirect("https://top.gg/bot/"+process.env.CLIENT_ID+"");
});
        
router.get("/donate", (request, response) => {
	response.redirect("");
});

module.exports = router;