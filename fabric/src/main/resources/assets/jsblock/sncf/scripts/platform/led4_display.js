include(Resources.id("jsblock:scripts/pids_util.js"));

include(Resources.id("jsblock:sncf/scripts/utils/sncf_utils.js"));
include(Resources.id("jsblock:sncf/scripts/utils/train_utils.js"));

function create(ctx, state, pids) {
    if(pids.type == "pids_1a") return;
    
    state.currentIndex = 0;
    state.updateTime = null;
}

function render(ctx, state, pids) {
    if(pids.type == "pids_1a") {
        Text.create()
        .text("PIDS non supportée.")
        .color(0xFFFFFF)
        .leftAlign()
        .scale(1)
        .pos(5, 5)
        .draw(ctx);

        return;
    }

    SncfUtils.drawFrame(ctx, pids, 9.8, false);

    const departure = pids.arrivals().get(0);

    if(departure != null) {
        let platforms = departure.route().platforms;
        if(platforms == null || platforms.length == 0) return;

        Texture.create()
        .texture("jsblock:sncf/images/backgrounds/platform/led/background_4.png")
        .size(pids.width + (9.8 * 2), pids.height + (5 * 2))
        .pos(-9.8, -5)
        .draw(ctx);

        let stations = [];

        for(let i = 0; i < platforms.length; i++) { 
            stations.push({
                name: platforms[i].stationName == "" ? "⚠ Undefined Name" : platforms[i].stationName,
                id: platforms[i].platformId
            });
        }

        const currentStation = departure.platformId();
        let currentIndex = stations.findIndex(station => station.id === currentStation);
        stations = stations.slice(currentIndex + 1);
        stations.push({
            name: "",
            id: "NULL-blanked"
        }, { name: "", id: "NULL-blanked-2" });

        let textColor = 0xEFA112;

        Text.create()
        .text(SncfUtils.displayStationName(cropName(SncfUtils.shortenNames(departure.destination() == "" ? "⚠ Undefined Name" : ""+departure.destination().toUpperCase())).toUpperCase()).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        .color(textColor)
        .scale(0.65)
        .pos(7, 24.75)
        .leftAlign()
        .draw(ctx);

        Text.create()
        .text("Depart prevu".toUpperCase())
        .color(textColor)
        .scale(0.65)
        .pos(7, 35.75)
        .leftAlign()
        .draw(ctx);

        const delay = TrainUtils.getTrainDelay(departure);
        let showDelay = false;

        if (delay != null) {
            showDelay = delay.time > 20;
        }

        Text.create()
        .text(""+SncfUtils.formatTime(departure.departureTime() - (delay.time * 1000), "h"))
        .color(textColor)
        .scale(0.65)
        .pos(pids.width - 6, 35.75)
        .rightAlign()
        .draw(ctx);

        if (showDelay) {
            Text.create()
            .text(("Retard " + SncfUtils.formatTrainDelay(delay.time, false, true) + " environ").toUpperCase())
            .color(textColor)
            .scale(0.65)
            .pos(7, 46.75)
            .leftAlign()
            .draw(ctx);
        }

        Text.create()
        .text(SncfUtils.displayStationName(cropName(SncfUtils.shortenNames(""+stations[state.currentIndex].name.toUpperCase())).toUpperCase()).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        .color(textColor)
        .scale(0.65)
        .pos(7, 57.75)
        .leftAlign()
        .draw(ctx);

        if(state.updateTime == null) {
            state.updateTime = Date.now();
        }

        if(Date.now() - state.updateTime >= 5000) {
            state.currentIndex++;
            if(state.currentIndex >= stations.length) {
                state.currentIndex = 0;
            }
            state.updateTime = Date.now();
        }
    } else {
        Text.create()
        .color(0xFFFFFF)
        .text("Aucun train à afficher.")
        .leftAlign()
        .scale(0.6)
        .pos(5, 5)
        .draw(ctx);

        return;
    }
}

function cropName(input) {
    const trimmed = input.trim();
    
    const latinRegex = /^[\u0041-\u007A\u002D\s]+$/; // Latin letters, hyphen, space
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/; // Hiragana, Katakana, Kanji
    const chineseRegex = /[\u4E00-\u9FFF]/; // CJK Unified Ideographs
    const koreanRegex = /[\uAC00-\uD7AF]/; // Hangul
    
    // Determine script and set max length
    let maxLength;
    if (latinRegex.test(trimmed)) {
      maxLength = 29; // Latin
    } else if (japaneseRegex.test(trimmed)) {
      maxLength = 20; // Japanese
    } else if (chineseRegex.test(trimmed)) {
      maxLength = 21; // Chinese
    } else if (koreanRegex.test(trimmed)) {
      maxLength = 23; // Korean
    } else {
      // Default to Latin length for mixed or other scripts
      maxLength = 29;
    }
    
    // Crop if necessary
    return trimmed.length > maxLength ? trimmed.substring(0, maxLength) + "..." : trimmed;
}