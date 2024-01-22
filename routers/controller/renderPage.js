const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.bearer_token) {
        res.status(200).render("pages/off/home", {
            features: require("../../json/features.json")
        });
    } else {
        res.status(200).render("pages/on/home", {
            user: req.session.user_info,
            features: require("../../json/features.json")
        });
    }

    console.log("a");
});

router.get("/about", async (request, response) => {
    if (!request.session.bearer_token) {
        response.status(200).render("pages/off/about");
    } else {
       response.status(200).render("pages/on/about", {
            user: request.session.user_info
        });
    };
});

router.get("/guidelines", async (request, response) => {
    if (!request.session.bearer_token) {
        response.status(200).render("pages/off/guidelines");
    } else {
        response.status(200).render("pages/on/guidelines", {
            user: request.session.user_info
        });
    }
})

module.exports = router;