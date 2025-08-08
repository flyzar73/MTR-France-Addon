include(Resources.id("jsblock:scripts/pids_util.js"));

function create(ctx, state, pids) {
    // Your custom logic here...
}

function render(ctx, state, pids) {
    Texture.create("Background").texture("jsblock:textures/backgrounds/siel.png").size(pids.width, pids.height).draw(ctx);
    let firstArrival = pids.arrivals().get(0);
    let secondArrival = pids.arrivals().get(1);

    if (firstArrival != null) {
        let destination = firstArrival.destination();
        Text.create("Destination").text(destination).color(0x023E91).pos(28, 5).size(75, 9).scaleXY().draw(ctx);
        let line = firstArrival.routeName().slice(-2).trim().toLowerCase();
        Texture.create("Line icon").texture("jsblock:textures/line_icons/line_" + line + ".png").pos(14, 2.5).size(11, 11).draw(ctx);
        Texture.create("Line-coloured bar").texture("jsblock:textures/backgrounds/siel_bar.png").color(firstArrival.routeColor()).size(pids.width, pids.height).draw(ctx);
        let eta1 = Math.round(((firstArrival.departureTime() - Date.now()) + 20000) / 60000);
        if (eta1 > 99) {
            Text.create("Arrival 1").text("++").color(0xECBB00).pos(47, 35).scale(4.5).rightAlign().draw(ctx);
        } else {
            Text.create("Arrival 1").text(eta1).color(0xECBB00).pos(47, 35).scale(4.5).rightAlign().draw(ctx);
        }
    } else {
        Text.create("Arrival 1").text("...").color(0xECBB00).pos(47, 35).scale(4.5).rightAlign().draw(ctx);
    }

    if (secondArrival != null) {
        let eta2 = Math.round(((secondArrival.departureTime() - Date.now()) + 20000) / 60000);
        if (eta2 > 99) {
            Text.create("Arrival 2").text("++").color(0xECBB00).pos(117, 35).scale(4.5).rightAlign().draw(ctx);
        } else {
            Text.create("Arrival 2").text(eta2).color(0xECBB00).pos(117, 35).scale(4.5).rightAlign().draw(ctx);
        }
    } else {
        Text.create("Arrival 2").text("...").color(0xECBB00).pos(117, 35).scale(4.5).rightAlign().draw(ctx);
    }

    now = new Date();
    Text.create("Clock").text(now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0')).color(0xECBB00).pos(pids.width - 25, 3).scale(1).draw(ctx);
}

function dispose(ctx, state, pids) {
    // Your custom logic here...
}