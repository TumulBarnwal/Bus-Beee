const Route = require("../models/Route");

const getAllRoutes = async (req, res) => {
    const routes = await Route.find();
    res.json(routes);
};


const addRoute = async (req, res) => {

    const newRoute = await Route.create({
        routeNo: "AC-5",
        stops: [
            "Garia",
            "Baghajatin",
            "Jadavpur",
            "Golpark",
            "Hazra",
            "Howrah"
        ]
    });

    res.json(newRoute);
};


const findDirectRoute = (bus, source, destination) => {

    const stops = bus.stops.map(
        stop => stop.toLowerCase().trim()
    );

    const sourceIndex = stops.indexOf(source);
    const destinationIndex = stops.indexOf(destination);

    if (
        sourceIndex !== -1 &&
        destinationIndex !== -1 &&
        sourceIndex < destinationIndex
    ) {
        return {
            sourceIndex,
            destinationIndex
        };
    }

    return null;
};


// ================= ONE TRANSFER ROUTES =================

const findOneTransferRoutes = (routes, source, destination) => {

    const transferRoutes = [];

    for (const busA of routes) {

        const busAStops = busA.stops.map(
            stop => stop.toLowerCase().trim()
        );

        const sourceIndex = busAStops.indexOf(source);

        if (sourceIndex === -1) {
            continue;
        }

        for (const busB of routes) {

            // Don't use the same bus twice
            if (busA.routeNo === busB.routeNo) {
                continue;
            }

            const busBStops = busB.stops.map(
                stop => stop.toLowerCase().trim()
            );

            const destinationIndex = busBStops.indexOf(destination);

            if (destinationIndex === -1) {
                continue;
            }

            // Look for a common transfer stop
            for (
                let i = sourceIndex + 1;
                i < busAStops.length;
                i++
            ) {

                const transferStop = busAStops[i];

                const transferIndexB =
                    busBStops.indexOf(transferStop);

                if (
                    transferIndexB !== -1 &&
                    transferIndexB < destinationIndex
                ) {

                    transferRoutes.push({
                        firstBus: busA,
                        secondBus: busB,
                        transferStop: busA.stops[i]
                    });

                    break;
                }
            }
        }
    }

    return transferRoutes;
};


// ================= SEARCH =================

const searchRoute = async (req, res) => {

    console.log("searchroute called");

    const source = req.body.source.trim().toLowerCase();
    const destination = req.body.destination.trim().toLowerCase();

    console.log("Source received:", source);
    console.log("Destination received:", destination);


    if (!source || !destination) {

        return res.status(400).json({
            message: "Source and destination are required"
        });
    }


    const routes = await Route.find();


    // ================= DIRECT ROUTES =================

    const result = routes.filter(bus => {
        return findDirectRoute(
            bus,
            source,
            destination
        );
    });


    const simplifiedResult = result.map(bus => {

        const stops = bus.stops.map(
            stop => stop.toLowerCase().trim()
        );

        const sourceIndex = stops.indexOf(source);
        const destinationIndex = stops.indexOf(destination);


        const stopsBetween = bus.stops.slice(
            sourceIndex + 1,
            destinationIndex
        );


        return {
            routeNo: bus.routeNo,
            stopsBetween: stopsBetween
        };
    });


    // ================= IF DIRECT ROUTE EXISTS =================

    if (simplifiedResult.length > 0) {

        console.log(
            "Direct routes found:",
            simplifiedResult
        );

        return res.json(simplifiedResult);
    }


    // ================= ONE TRANSFER =================

    console.log(
        "No direct route. Searching for one transfer..."
    );


    const transferRoutes = findOneTransferRoutes(
        routes,
        source,
        destination
    );


    if (transferRoutes.length === 0) {

        console.log("No routes found");

        return res.status(404).json({
            message: "No routes found"
        });
    }


    // ================= FORMAT TRANSFER RESULTS =================

    const formattedTransferRoutes =
        transferRoutes.map(route => {

            const busAStops = route.firstBus.stops.map(
                stop => stop.toLowerCase().trim()
            );

            const busBStops = route.secondBus.stops.map(
                stop => stop.toLowerCase().trim()
            );


            const sourceIndex =
                busAStops.indexOf(source);

            const transferIndexA =
                busAStops.indexOf(
                    route.transferStop.toLowerCase().trim()
                );

            const transferIndexB =
                busBStops.indexOf(
                    route.transferStop.toLowerCase().trim()
                );

            const destinationIndex =
                busBStops.indexOf(destination);


            return {

                type: "transfer",

                transferAt: route.transferStop,

                firstBus: {
                    routeNo: route.firstBus.routeNo,

                    stopsBetween:
                        route.firstBus.stops.slice(
                            sourceIndex + 1,
                            transferIndexA
                        )
                },

                secondBus: {
                    routeNo: route.secondBus.routeNo,

                    stopsBetween:
                        route.secondBus.stops.slice(
                            transferIndexB + 1,
                            destinationIndex
                        )
                }
            };
        });


    console.log(
        "Transfer routes:",
        formattedTransferRoutes
    );


    res.json(formattedTransferRoutes);
};


const getRouteByNumber = async (req, res) => {

    const routeNo = req.params.routeNo;

    const bus = await Route.findOne({
        routeNo
    });


    if (!bus) {

        return res.status(404).json({
            message: "Route not found"
        });
    }


    res.json(bus);
};


const getAllStops = async (req, res) => {

    const routes = await Route.find();

    const stops = [];


    routes.forEach(bus => {

        bus.stops.forEach(stop => {

            if (!stops.includes(stop)) {
                stops.push(stop);
            }

        });

    });


    res.json(stops);
};


module.exports = {
    getAllRoutes,
    searchRoute,
    getRouteByNumber,
    getAllStops,
    addRoute
};