const express = require("express");
const expressSession = require("express-session");
const fetch = require("node-fetch");
const FormData = require("form-data");

const router = express.Router();
const config = require("../../json/config.json");
let usermodel = require("../../database/models/user.js")

router.use(expressSession({
    secret: process.env.SECRET,
    ...require("../../json/session.json")
}));

router.get("/login/callback", async (request, response) => {
    let redirect_uri = config.test_mode ? "http://localhost:3000/login/callback" : `https://${request.hostname.replace("t", "T")}/login/callback`
    let accessCode = await request.query.code;

    if (!accessCode) return response.redirect("/");

    const data = new FormData();

    data.append("client_id", process.env.CLIENT_ID);
    data.append("client_secret", process.env.CLIENT_SECRET);
    data.append("grant_type", "authorization_code");
    data.append("redirect_uri", redirect_uri);
    data.append("scope", "identify");
    data.append("code", accessCode);

    const jso1n = await (await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: data
    }))
    //console.log(jso1n)
    let json = await jso1n.json()

    const userJson = await (await fetch("https://discord.com/api/users/@me", {
        headers: {
            authorization: `${json.token_type} ${json.access_token}`,
        },
    })).json();
    //console.log(userJson)
    request.session.user_info = userJson;
    request.session.bearer_token = json.access_token;
    
    return response.redirect("/dashboard");
});

router.get("/login", (request, response) => {
    let redirect_uri = config.test_mode ? "http://localhost:3000/login/callback" : `https://${request.hostname.replace("t", "T")}/login/callback`
    response.redirect(`https://discord.com/api/oauth2/authorize` +
        `?client_id=${process.env.CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
        `&response_type=code&scope=${encodeURIComponent(config.oauth2.scopes.join(" "))}`);
});

router.get("/logout", (request, response) => {
    if (!request.session.bearer_token) {
        response.redirect("/");
    } else {
        request.session.destroy();
        response.redirect("/");
    };
});

module.exports = router;