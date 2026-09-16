const express = require("express");

const {
    getAllRoutes,
    searchRoute,
    getRouteByNumber,
    getAllStops,
    addRoute
} = require("../controller/route.controller");

const router = express.Router();

router.get("/", getAllRoutes);

router.post("/search", searchRoute);

router.get("/stops/all", getAllStops);

router.get("/:routeNo", getRouteByNumber);

router.post("/add", addRoute);

module.exports = router;