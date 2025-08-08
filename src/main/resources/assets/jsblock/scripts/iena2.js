include(Resources.id("jsblock:scripts/pids_util.js"));

function create(ctx, state, pids) {
}

function render(ctx, state, pids) {
    Texture.create("Background").texture("jsblock:textures/backgrounds/iena2.png").size(pids.width, pids.height).draw(ctx);
    for (let i = 0; i < 4; i++) {
        let rowY = 16 + (i*16);
        let arrival = pids.arrivals().get(i);
        if (arrival != null) {
            let line = arrival.routeName().slice(-2).trim().toLowerCase();
            let eta = new Date(arrival.arrivalTime());
            eta = eta.getHours().toString().padStart(2, '0') + ":" + eta.getMinutes().toString().padStart(2, '0');
            Texture.create("Line Icon").texture("jsblock:textures/line_icons/line_" + line + ".png").pos(2, rowY - 0.5).size(9, 9).draw(ctx);
            Text.create("Mission").text(arrival.routeNumber()).color(0xFFFFFF).scale(0.6).pos(13, rowY + 1.5).size(18, 15).stretchXY().draw(ctx);
            Text.create("Arrival Destination").text(arrival.destination()).color(0xFFFFFF).pos(27, rowY).size(73, 15).stretchXY().draw(ctx);
            Text.create("Arrival Time").text(eta).color(0xFFFFFF).scale(0.75).rightAlign().pos(pids.width - 16, rowY + 1).draw(ctx);
            Text.create("Platform Number").text(arrival.platformName()).pos(pids.width - 8.5, rowY + 1).centerAlign().color(0x0C153E).scale(0.75).draw(ctx);
        } else {
            Texture.create("Background").texture("jsblock:textures/backgrounds/iena2_quai_non_desservi.png").size(pids.width, pids.height).draw(ctx);
        }
    }
    now = new Date();
    Text.create("Clock").text(now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0')).color(0xFFFFFF).pos(3, 3).scale(0.75).draw(ctx);
}

function dispose(ctx, state, pids) {
    // Your custom logic here...
}