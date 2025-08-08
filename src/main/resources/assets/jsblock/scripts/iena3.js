include(Resources.id("jsblock:scripts/pids_util.js"));

function create(ctx, state, pids) {
    // Your custom logic here...
}

function render(ctx, state, pids) {
    // MODIFIABLE : nombre de voitures à partir duquel un train est considéré comme long
    // Valeur par défaut : longTrainMinimumCars = 7 (train considéré comme long à partir de 7 voitures, considéré comme court s'il compte 6 voitures ou moins)
    let longTrainMinimumCars = 7;

    let arrival = pids.arrivals().get(0);
    if (arrival != null) {
        Texture.create("Background").texture("jsblock:textures/backgrounds/iena3.png").size(pids.width, pids.height).draw(ctx);

        let routeStations = [];
        for (let i = 0; i < arrival.route().getPlatforms().length; i++) {
            let station = arrival.route().getPlatforms()[i].stationName;
            routeStations[i] = station;
        }

        let currentStationName = pids.station().name;
        routeStations = routeStations.map(station => station.normalize('NFC'));
        currentStationName = currentStationName.normalize('NFC');
        let currentStationIndex = routeStations.indexOf(currentStationName);
        routeStations = routeStations.slice(currentStationIndex + 1);

        if (routeStations.length == 0) {
            Texture.create("Background").texture("jsblock:textures/backgrounds/iena3_terminus.png").size(pids.width, pids.height).draw(ctx);
        } else if (routeStations.length < 13) {
            for (let i = 0; i < Math.min(routeStations.length, 6); i++) {
                Text.create("Station").text(routeStations[i]).color(0xFFFFFF).scale(0.6).size(60, 8).stretchXY().pos(51, 32 + 7.4*i).draw(ctx);
            }
            for (let i = 0; i < Math.min(routeStations.length - 6, 6); i++) {
                Text.create("Station").text(routeStations[i+6]).color(0xFFFFFF).scale(0.6).size(60, 8).stretchXY().pos(95, 32 + 7.4*i).draw(ctx);
            }
        } else if (routeStations.length < 25) {
            Text.create("Page").text("Page").color(0xFFFFFF).scale(0.4).pos(34, 32).draw(ctx);
            Text.create("Page number").text(TextUtil.cycleString("1/2|2/2")).color(0xFFFFFF).scale(0.4).pos(34, 37).draw(ctx);
            for (let i = 0; i < Math.min(routeStations.length, 6); i++) {
                Text.create("Station").text(TextUtil.cycleString(routeStations[i] + "|" + (routeStations[i+12] || " "))).color(0xFFFFFF).scale(0.6).size(60, 8).stretchXY().pos(51, 32 + 7.4*i).draw(ctx);
            }
            for (let i = 0; i < Math.min(routeStations.length - 6, 6); i++) {
                Text.create("Station").text(TextUtil.cycleString(routeStations[i+6] + "|" + (routeStations[i+18] || " "))).color(0xFFFFFF).scale(0.6).size(60, 8).stretchXY().pos(95, 32 + 7.4*i).draw(ctx);
            }
        }

        let line = arrival.routeName().slice(-2).trim().toLowerCase();
        Texture.create("Line icon").texture("jsblock:textures/line_icons/line_" + line + ".png").pos(34, 19).size(10, 10).draw(ctx);
        Text.create("Arrival Destination").text(arrival.destination()).color(0xFFFFFF).scale(1).size(55, 6).stretchXY().pos(46, 18).draw(ctx);
        Text.create("Mission").text(arrival.routeNumber()).color(0xFFFFFF).scale(0.5).pos(46, 25).draw(ctx);
        Text.create("Platform Number").text(arrival.platformName()).pos(pids.width - 5.5, 2.5).size(8, 8).scaleXY().scale(1).centerAlign().color(0x0C153E).draw(ctx); 

        if (arrival.carCount() >= longTrainMinimumCars) {
            Text.create("Train length").text("Train long").color(0xFFFFFF).scale(0.4).centerAlign().pos(pids.width - 14, 12.5).draw(ctx);
        } else {
            Text.create("Train length").text("Train court").color(0xFFFFFF).scale(0.4).centerAlign().pos(pids.width - 14, 12.5).draw(ctx);
        }
        
        let eta = Math.ceil(((arrival.arrivalTime() - Date.now())) / 60000);
        if (eta <= 0) {
            Text.create("ETA Text").text("à quai").color(0xFFFFFF).size(30, 7).scaleXY().rightAlign().pos(pids.width - 2, 20).draw(ctx);
        } else if (eta <= 1) {
            Text.create("ETA Text").text("à l'approche").color(0xFFFFFF).size(30, 7).scaleXY().rightAlign().pos(pids.width - 2, 20).draw(ctx);
        } else {
            Text.create("ETA Text").text(eta + " min").color(0xFFFFFF).size(30, 7).scaleXY().rightAlign().pos(pids.width - 2, 20).draw(ctx);
        }
    } else {
        Texture.create("Background").texture("jsblock:textures/backgrounds/iena3_quai_non_desservi.png").size(pids.width, pids.height).draw(ctx);
    }
    now = new Date();
    Text.create("Clock").text(now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0')).color(0x0C153E).pos(3, 3).scale(0.75).draw(ctx);
}

function dispose(ctx, state, pids) {
    // Your custom logic here...
}