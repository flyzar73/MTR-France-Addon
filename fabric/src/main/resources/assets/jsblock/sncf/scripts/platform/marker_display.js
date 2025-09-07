include(Resources.id("jsblock:scripts/pids_util.js"));

function render(ctx, state, pids) {
    if(pids.type != "rv_pids") {
        Text.create()
        .text("Not compatible with this PIDS type")
        .leftAlign()
        .scale(1.5)
        .color(0xFF0000)
        .pos(5, 5)
        .draw(ctx);

        return;
    }

    Texture.create()
    .texture("jsblock:sncf/images/backgrounds/platform/marker/background.png")
    .size(pids.width, pids.height)
    .draw(ctx);

    drawFrame(ctx, pids, 5.1);

    const departure = pids.arrivals().get(0);
    const message = (""+pids.getCustomMessage(0)).trim();
    let letter = "?";

    if(departure != null) {
        const platform = (""+departure.platformName()).trim().split("|");

        Texture.create()
        .texture("jsblock:sncf/images/pictograms/voie.png")
        .size(13, 4.75)
        .pos(112, 2.5)
        .draw(ctx);

        Text.create()
        .text(platform[0].trim())
        .centerAlign()
        .scale(2)
        .color(0xA1E1F9)
        .pos(120, 10)
        .draw(ctx);

        Texture.create()
        .texture("jsblock:sncf/images/pictograms/line.png")
        .size(25, 1)
        .pos(106.5, 26)
        .draw(ctx);

        if(platform.length > 1 && !pids.isPlatformNumberHidden()) {
            letter = platform[1].trim()[0];
        } else if(message != "") {
            letter = message[0];
        }
    } else if(message != "") {
        letter = message[0];
    }

    Text.create()
    .text("Repère")
    .centerAlign()
    .scale(0.9)
    .color(0xFFFFFF)
    .pos(45.5, 3.5) //51.25
    .draw(ctx);

    Text.create()
    .text(letter.toUpperCase())
    .centerAlign()
    .scale(7)
    .color(0xFFFFFF)
    .pos(49, 18) // 55
    .draw(ctx);

    for(let i = 0; i < 21; i++) {
        Text.create()
        .text(".")
        .centerAlign()
        .scale(0.9)
        .color(0xFFFFFF)
        .pos(97.5, (3.5 * i) - 3.5)
        .draw(ctx);
    }
}

function drawFrame(ctx, pids, size) {
    const texture = "jsblock:sncf/images/backgrounds/platform/marker/background.png"

    Texture.create("Frame-Top")
    .texture(texture)
    .size(pids.width + (size * 2), size)
    .pos(-size, -size)
    .draw(ctx);
    
    Texture.create("Frame-Bottom")
    .texture(texture)
    .size(pids.width + (size * 2), size)
    .pos(-size, pids.height)
    .draw(ctx);
    
    Texture.create("Frame-Left")
    .texture(texture)
    .size(size, pids.height + (size * 2))
    .pos(-size, -size)
    .draw(ctx);
    
    Texture.create("Frame-Right")
    .texture(texture)
    .size(size, pids.height + (size * 2))
    .pos(pids.width, -size)
    .draw(ctx);
}