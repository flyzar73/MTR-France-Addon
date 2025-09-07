include(Resources.id("jsblock:scripts/pids_util.js"));

include(Resources.id("jsblock:sncf/scripts/utils/sncf_utils.js"));
include(Resources.id("jsblock:sncf/scripts/utils/train_utils.js"));

const totalHeight = 68.6;

const MAX_VISIBLE_STOPS = 10;
const STOP_HEIGHT = 5;
const DEPARTURE_MESSAGE_DURATION = 10;
const TIME_BETWEEN_STATES = 10;

const ScrollState = {
    BEGIN: "BEGIN",
    SCROLLING: "SCROLLING",
    END: "END"
};

function create(ctx, state, pids) {
    if(pids.type == "pids_1a") return;

    if(state.scroll != null) return;

    state.scroll = {
        currentState: ScrollState.BEGIN,
        stations: [],
        fixedStations: [],
        isTerminating: false,
        currentStationIndex: 0,
        scrollOffset: -1.5,
        timeInState: 0,
        rateLimit: new RateLimit(0.033) // ~30 FPS
    };
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

    const departure = pids.arrivals().get(0);

    if(departure != null && state.scroll != null) {
        let platforms = departure.route().platforms; // "NULL"
        if(platforms == null || platforms.length == 0) return;

        const departureTime = departure.departureTime();
        const timestamp = Timing.currentTimeMillis();
    
        if(departure.terminating()) {
            if (departureTime - timestamp <= 15000 && departureTime - timestamp >= -6000) {
                if ((Math.floor(timestamp / 1000) % 8) < 3) {
                    Texture.create()
                    .texture("jsblock:sncf/images/backgrounds/platform/display/terminating.png")
                    .size(pids.width, pids.height)
                    .draw(ctx);

                    SncfUtils.drawFrame(ctx, pids, 9.8, false);
                    return;
                }
            }

            Texture.create()
            .texture("jsblock:sncf/images/backgrounds/platform/display/arrival_background.png")
            .size(pids.width, pids.height)
            .draw(ctx);
        } else {
            if (departureTime - timestamp <= (DEPARTURE_MESSAGE_DURATION * 1000) && departureTime - timestamp >= -6000) {
                Texture.create()
                .texture("jsblock:sncf/images/backgrounds/platform/display/train_departing.png")
                .size(pids.width, pids.height)
                .draw(ctx);
        
                if (Math.floor(timestamp / 1000) % 2 == 0) {
                    Texture.create()
                    .texture("jsblock:sncf/images/pictograms/forbidden_boarding.png")
                    .size(55, 55)
                    .pos(21, 7.4)
                    .draw(ctx);
                }

                SncfUtils.drawFrame(ctx, pids, 9.8, true);
                return;
            }

            Texture.create()
            .texture("jsblock:sncf/images/backgrounds/platform/display/departure_background.png")
            .size(pids.width, pids.height)
            .draw(ctx);
        }

        let stations = [];

        if(state.scroll.stations.length == 0) {
            for(let i = 0; i < platforms.length; i++) { 
                stations.push({
                    name: platforms[i].stationName,
                    id: platforms[i].platformId
                });
            }

            state.scroll.stations = stations;
            state.scroll.fixedStations = stations;
        }

        if(!departure.terminating()) {
            const currentStation = departure.platformId();
            let currentIndex = state.scroll.stations.findIndex(station => station.id === currentStation);

            if (currentIndex !== -1) {
                state.scroll.stations = state.scroll.stations.slice(currentIndex + 1);
            }
        } else if(state.scroll.isTerminating == false) {
            state.scroll.stations = state.scroll.stations.slice(0, -1);
            state.scroll.isTerminating = true;
        }

        if(state.scroll.stations.length > MAX_VISIBLE_STOPS) handleScrollState(ctx, state.scroll, pids);
        if(state.scroll.stations.length > 0) drawStationList(ctx, state.scroll, pids, departure.terminating());

        drawLeftPanel(ctx, state.scroll, pids, departure);
        drawTextInformation(ctx, state, pids);

        SncfUtils.drawClock(ctx, pids, timestamp);
    } else {
        Text.create()
        .color(0xFFFFFF)
        .text("Aucun train à afficher.")
        .leftAlign()
        .scale(0.6)
        .pos(5, 5)
        .draw(ctx);
    }

    SncfUtils.drawFrame(ctx, pids, 9.8, false);
}

function drawLeftPanel(ctx, scroll, pids, departure) {
    drawTrainDepartureHour(ctx, scroll, pids, departure);
    drawTrainDestination(ctx, scroll, pids, departure);
}

function drawTrainDepartureHour(ctx, scroll, pids, departure) {
    const delay = TrainUtils.getTrainDelay(departure);

    const isTerminating = departure.terminating();
    const color = isTerminating ? 0x006E30 : 0x014494;
    let showDelay = false;

    const timeLimitToShowDelay = 20; // seconds

    if (delay != null && delay.time > timeLimitToShowDelay) {
        showDelay = (Math.floor(Timing.currentTimeMillis() / 1000) % 5) < 2;
    }

    if(showDelay) {
        Text.create()
        .text("retard " + SncfUtils.formatTrainDelay(delay.time, false, false) + ".")
        .color(color)
        .scale(0.4)
        .pos(2.25, 10.8)
        .draw(ctx);
    } else {
        Text.create()
        .text(SncfUtils.formatTime((isTerminating ? departure.arrivalTime() : departure.departureTime()) - (delay.time * 1000), "h"))
        .color(color)
        .bold()
        .scale(0.6)
        .pos(2.25, 9.425)
        .draw(ctx);

        if(delay.time <= timeLimitToShowDelay) {
            const onTimeMessages = ["À l'heure", "On time", "In orario"];

            Text.create()
            .text(onTimeMessages[Math.floor(Timing.currentTimeMillis() / 3000) % onTimeMessages.length].toLowerCase())
            .color(color)
            .centerAlign()
            .scale(0.28)
            .pos(34.125, 11.875)
            .draw(ctx);
        }
    }
}

function drawTrainDestination(ctx, scroll, pids, departure) {
    const isTerminating = departure.terminating();
    const color = isTerminating ? 0x006E30 : 0x014494;
    const destination = departure.destination() == "" ? "⚠ Undefined Name" : ""+departure.destination();

    let lines = isTerminating ? SncfUtils.convertNameToLines(SncfUtils.shortenNames(scroll.fixedStations[0].name == "" ? "⚠ Undefined Name" : ""+scroll.fixedStations[0].name)) : SncfUtils.convertNameToLines(SncfUtils.shortenNames(destination));
    let startY = 20;
    let viaBonus = 0;
    const LINE_HEIGHT = 4.5;

    for(let i = 0; i < lines.length; i++) {
        if(lines[i].text.startsWith("Via")) viaBonus += 1;

        Text.create()
        .text(lines[i].text)
        .color((departure.destination() == "" || (isTerminating && scroll.fixedStations[0].name == "")) ? 0xE33B19 : color)
        .scale(0.51)
        .size(42.5, LINE_HEIGHT)
        .bold()
        .pos(2.25, startY + viaBonus + (i * (LINE_HEIGHT + lines[i].margin)))
        .draw(ctx);
    }

    if(lines[lines.length-1] == undefined) lines[lines.length-1] = { text: "", margin: 0.5 };

    let newY = startY + viaBonus + (lines.length * (LINE_HEIGHT + lines[lines.length-1].margin)) + 2.25;

    drawTrainInformation(ctx, scroll, pids, departure, newY);
}

function drawTrainInformation(ctx, scroll, pids, departure, startY) {
    const routeInfo = TrainUtils.getRouteInfo(departure);
    const trainType = routeInfo.trainType;
    const trainNumber = routeInfo.trainNumber;

    let trainName = TrainUtils.findNameFromAlias(trainType) || "SNCF";

    if (TrainUtils.isMatchingOneAliasOfType(trainName, TRAIN_TYPES.CAR)) {
        Texture.create()
        .texture("jsblock:sncf/images/pictograms/bus-black.png")
        .size(10, 10)
        .pos(1.5, pids.height - 19.5)
        .draw(ctx);
    }

    const trainNamePixelSize = 0.37;
    const transilienPixelSize = 0.3;
    let useTransilienPixelSize = false;
    let startX = 1.9;

    const isItTransilien = TrainUtils.isMatchingOneAliasOfType(trainName, TRAIN_TYPES.TRANSILIEN);
    let lineName = routeInfo.parts.length > 2 ? routeInfo.parts[2].trim().toUpperCase() : null;

    if(isItTransilien && lineName != null) {
        useTransilienPixelSize = true;

        Texture.create()
        .texture("jsblock:sncf/images/pictograms/train.png")
        .size(2.25, 2.25)
        .pos(startX, startY)
        .draw(ctx);

        startX += 2.75;

        Texture.create()
        .texture("jsblock:sncf/images/pictograms/platform_border.png")
        .color(departure.routeColor())
        .size(2, 2)
        .pos(startX+0.225, startY)
        .draw(ctx);

        Text.create()
        .text(lineName)
        .color(departure.routeColor())
        .scale(transilienPixelSize / 2)
        .centerAlign()
        .pos(startX + 1.3, startY + 0.5)
        .draw(ctx);

        startX += 3.125;
        trainName = trainName.toUpperCase();

        Text.create()
        .text(trainName)
        .color(0x00409D)
        .scale(transilienPixelSize - 0.0125)
        .leftAlign()
        .pos(startX, startY)
        .draw(ctx);
    } else {
        Text.create()
        .text(trainName)
        .color(0x00409D)
        .scale(trainNamePixelSize)
        .leftAlign()
        .pos(startX, startY)
        .draw(ctx);
    }

    scroll.trainNameWidth = 0;

    for(let i = 0; i < trainName.length; i++) {
        scroll.trainNameWidth += SncfUtils.getCharWidth(trainName[i], useTransilienPixelSize ? transilienPixelSize-0.0125 : trainNamePixelSize);
        if(i < trainName.length - 1) scroll.trainNameWidth += useTransilienPixelSize ? transilienPixelSize-0.0125 : trainNamePixelSize;
    }

    const posX = startX + scroll.trainNameWidth + 1.375;
    Text.create()
    .text(trainNumber)
    .color(0x7C86B5)
    .scale(0.35)
    .leftAlign()
    .pos(posX, startY + (useTransilienPixelSize ? 0.275 : 0.25))
    .draw(ctx);
}

function drawTextInformation(ctx, state, pids) {
    let text = [];

    for(let i = 0; i < pids.rows; i++) {
        if(pids.getCustomMessage(i) != "") text.push(pids.getCustomMessage(i));
    }

    const TEXT_HEIGHT = 6.25;

    Text.create()
    .text(SncfUtils.formatText(text))
    .color(0xFFFFFF)
    .italic()
    .scale(0.5)
    .marquee()
    .size(224, TEXT_HEIGHT)
    .pos(0.75, pids.height - TEXT_HEIGHT + 0.5)
    .draw(ctx);
}

function handleScrollState(ctx, scroll, pids) {
    if (!scroll.rateLimit.shouldUpdate()) return;

    const delta = Timing.delta();
    if (scroll.timeInState == null) scroll.timeInState = 0;
    scroll.timeInState += delta;

    switch (scroll.currentState) {
        case ScrollState.BEGIN:
            if (scroll.timeInState > TIME_BETWEEN_STATES) {
                scroll.currentState = ScrollState.SCROLLING;
                scroll.timeInState = 0;
            }
            break;
        case ScrollState.SCROLLING:
            const speed = 0.075 / (30 / 1000); // Vitesse calculée : 0.075 / (30 ms)
            scroll.scrollOffset += speed * delta;
            while (scroll.scrollOffset >= (STOP_HEIGHT + 0.25)) {
                if (scroll.currentStationIndex >= scroll.stations.length - MAX_VISIBLE_STOPS) {
                    scroll.currentState = ScrollState.END;
                    scroll.timeInState = 0;
                    scroll.scrollOffset = -1.5;
                    break;
                } else {
                    scroll.currentStationIndex++;
                    scroll.scrollOffset -= (STOP_HEIGHT + 0.25);
                }
            }
            break;
        case ScrollState.END:
            if (scroll.timeInState > TIME_BETWEEN_STATES) {
                scroll.currentState = ScrollState.BEGIN;
                scroll.timeInState = 0;
                scroll.scrollOffset = -1.5;
                scroll.currentStationIndex = 0;
            }
            break;
    }
}

function drawStationList(ctx, scroll, pids, isTerminating) {
    let stations = scroll.stations;

    const lastStationWidth = (""+stations[stations.length - 1].name).length * 2.25;

    const calculateDynamicMargin = (numStations) => {
        const minStations = 2;
        const maxStations = 10;
        const maxMargin = 18;
        const minMargin = 2;
    
        if (numStations <= minStations) {
            return maxMargin;
        } else if (numStations >= maxStations) {
            return minMargin;
        } else {
            const range = maxStations - minStations;
            const progress = (numStations - minStations) / range; 
            const exponent = 2;
            const margin = maxMargin * Math.pow(1 - progress, exponent);
            return Math.max(minMargin, margin);
        }
    };
    
    let dynamicMargin = calculateDynamicMargin(stations.length);

    const totalStopsHeight = stations.length * STOP_HEIGHT;
    const totalMarginHeight = (stations.length - 1) * dynamicMargin;
    const totalContentHeight = totalStopsHeight + totalMarginHeight;

    let startY = -scroll.scrollOffset;
    let maxI = MAX_VISIBLE_STOPS + 1;
    let lineHeightSize = (totalHeight + STOP_HEIGHT) - scroll.scrollOffset;

    if(stations.length < MAX_VISIBLE_STOPS) {
        maxI = stations.length;
        startY = (totalHeight - totalContentHeight) / 2;
        lineHeightSize = startY + (STOP_HEIGHT * stations.length) + (dynamicMargin * (stations.length-1));
    }

    Texture.create()
    .texture(isTerminating ? "jsblock:sncf/images/green_square.png" : "jsblock:sncf/images/aqua_square.png")
    .size(2, lineHeightSize)
    .pos(50.125, 0)
    .draw(ctx);

    for (let i = scroll.scrollOffset > (STOP_HEIGHT + 0.25) ? 1 : 0; i < maxI; i++) {
        const pixelSize = 0.45;
        let stationName = ""+stations[i + scroll.currentStationIndex].name == "" ? "⚠ Undefined Name" : ""+stations[i + scroll.currentStationIndex].name;
        stationName = cropName(SncfUtils.displayStationName(SncfUtils.shortenNames(stationName))).split(" Via")[0];

        if(stations[i + scroll.currentStationIndex].id === scroll.fixedStations[scroll.fixedStations.length - 1].id) {
            scroll.lastStationNameWidth = 0;

            for(let j = 0; j < stationName.length; j++) {
                scroll.lastStationNameWidth += SncfUtils.getCharWidth(stationName[j], pixelSize);
                if(j < stationName.length - 1) scroll.lastStationNameWidth += pixelSize;
            }

            Texture.create()
            .texture("jsblock:sncf/images/aqua_square.png")
            .size(4.875 + scroll.lastStationNameWidth + 2.875, STOP_HEIGHT + 2)
            .pos(50.125, startY + (i * (STOP_HEIGHT + dynamicMargin)) - (STOP_HEIGHT / 3))
            .draw(ctx);
        }

        Texture.create()
        .texture("jsblock:sncf/images/pictograms/station_dot.png")
        .size(1.75, 1.75)
        .pos(50.25, startY + (i * (STOP_HEIGHT + dynamicMargin)) + 0.75)
        .draw(ctx);

        Text.create()
        .text(stationName)
        .color(0xFFFFFF)
        .leftAlign()
        .scale(pixelSize)
        .size(75, STOP_HEIGHT)
        .pos(55, startY + (i * (STOP_HEIGHT + dynamicMargin)))
        .draw(ctx);
    }

    if(isTerminating)
        Texture.create()
        .texture("jsblock:sncf/images/backgrounds/platform/display/arrival_footer.png")
        .size(pids.width, pids.height)
        .draw(ctx);
    else
        Texture.create()
        .texture("jsblock:sncf/images/backgrounds/platform/display/departure_footer.png")
        .size(pids.width, pids.height)
        .draw(ctx);
}

function cropName(input) {
    let trimmed = input.trim();
  
    const latinRegex = /^[\u0041-\u007A\u002D\s]+$/; // Latin letters, hyphen, space
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/; // Hiragana, Katakana, Kanji
    const chineseRegex = /[\u4E00-\u9FFF]/; // CJK Unified Ideographs
    const koreanRegex = /[\uAC00-\uD7AF]/; // Hangul
  
    // Determine script and set to max length
    let maxLength;
    if (latinRegex.test(trimmed)) {
        maxLength = 28; // Latin
        trimmed = trimmed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    } else if (japaneseRegex.test(trimmed)) {
        maxLength = 19; // Japanese
    } else if (chineseRegex.test(trimmed)) {
        maxLength = 20; // Chinese
    } else if (koreanRegex.test(trimmed)) {
        maxLength = 22; // Korean
    } else {
        // Default to Latin length for mixed or other scripts
        maxLength = 28;
    }
  
    // Crop if necessary
    return trimmed.length > maxLength ? trimmed.substring(0, maxLength) + "..." : trimmed;
}