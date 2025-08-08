include(Resources.id("jsblock:scripts/pids_util.js"));

function create(ctx, state, pids) {
}

function render(ctx, state, pids) {
    Texture.create("Background").texture("jsblock:textures/backgrounds/iena1.png").size(pids.width, pids.height).draw(ctx);
    for (let i = 0; i < 4; i++) {
        let rowY = i*16 + 3.5;
        let arrival = pids.arrivals().get(i);
        if (arrival != null) {
            let line = arrival.routeName().slice(-2).trim().toLowerCase();
            Texture.create("Line Icon").texture("jsblock:textures/line_icons/line_" + line + ".png").pos(2, rowY - 0.5).size(9, 9).draw(ctx);
            Text.create("Mission").text(arrival.routeNumber()).color(0xFFFFFF).scale(0.6).pos(13, rowY + 1.5).size(18, 15).stretchXY().draw(ctx);
            Text.create("Arrival Destination").text(arrival.destination()).color(0xFFFFFF).pos(27, rowY).size(70, 15).stretchXY().draw(ctx);
            Text.create("Platform Number").text(arrival.platformName()).pos(pids.width - 8.5, rowY + 1).centerAlign().color(0x0C153E).scale(0.75).draw(ctx);
            let eta = Math.ceil(((arrival.arrivalTime() - Date.now())) / 60000);
            if (eta <= 0) {
                Text.create("ETA Text").text("à quai").color(0xFFFFFF).size(25, 9).scale(0.75).stretchXY().rightAlign().pos(pids.width - 16, rowY + 1).draw(ctx);
            } else if (eta <= 1) {
                Text.create("ETA Text").text("à l'approche").color(0xFFFFFF).size(25, 9).scale(0.75).stretchXY().rightAlign().pos(pids.width - 16, rowY + 1).draw(ctx);
            } else {
                Text.create("ETA Text").text(eta + " min").color(0xFFFFFF).size(25, 9).scale(0.75).stretchXY().rightAlign().pos(pids.width - 16, rowY + 1).draw(ctx);
            }
        } else {
            Texture.create("Background").texture("jsblock:textures/backgrounds/iena1_quai_non_desservi.png").size(pids.width, pids.height).draw(ctx);
        }
    }
    now = new Date();
    Text.create("Clock").text(now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0')).color(0x0C153E).pos(pids.width - 21, pids.height - 8).scale(0.75).draw(ctx);
}

function dispose(ctx, state, pids) {
    // Your custom logic here...
}