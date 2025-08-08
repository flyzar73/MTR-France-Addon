include(Resources.id("jsblock:scripts/pids_util.js"));

include(Resources.id("jsblock:sncf/scripts/utils/sncf_utils.js"));
include(Resources.id("jsblock:sncf/scripts/utils/train_utils.js"));
include(Resources.id("jsblock:sncf/scripts/utils/warning_manager.js"));

const MAX_HEIGHT = 67.8;

const MAX_VISIBLE_LETTERS = 41;
const LETTER_HEIGHT = 5;
const TIME_BETWEEN_STATES = 3;

const ScrollState = {
    BEGIN: "BEGIN",
    SCROLLING: "SCROLLING",
    END: "END"
};

function initScrolls(state, pids) {
    if(state.scrolls == null) state.scrolls = [];

    for(let i = 0; i < pids.rows; i++) {
        if(state.scrolls[i] == null) {
            state.scrolls[i] = {
                currentState: ScrollState.BEGIN,
                stations: [],
                stops: "",
                currentLetterIndex: 0,
                scrollOffset: 0,
                timeInState: 0
            };
        }
    }
}

function create(ctx, state, pids) {
    initScrolls(state, pids);
    if(state.warningManager == null) state.warningManager = new WarningManager();
}

function render(ctx, state, pids) {
    Texture.create()
    .texture("jsblock:sncf/images/backgrounds/station/arrivals_background.png")
    .size(pids.width, pids.height)
    .draw(ctx);

    const ROW_HEIGHT = MAX_HEIGHT / pids.rows;

    initScrolls(state, pids);

    for(let i = 0; i < pids.rows; i++) {
        let departure = pids.arrivals().get(i);
        let isRowHidden = pids.isRowHidden(i);
        let scroll = state.scrolls[i];
        let isOdd = i % 2 == 1;

        if(isOdd) {
            Texture.create()
            .texture("jsblock:sncf/images/backgrounds/station/arrival_odd.png")
            .size(pids.width, ROW_HEIGHT)
            .pos(0, i * ROW_HEIGHT)
            .draw(ctx);
        }

        if(departure != null) {
            let startY = i * ROW_HEIGHT;

            drawStationList(ctx, scroll, pids, startY, i, ROW_HEIGHT, departure, isRowHidden, isOdd);

            Texture.create()
            .texture("jsblock:sncf/images/backgrounds/station/arrival_text.png")
            .size(pids.width, pids.height)
            .draw(ctx);
        }
    }

    for(let i = 0; i < pids.rows; i++) {
        let departure = pids.arrivals().get(i);
        let isRowHidden = pids.isRowHidden(i);

        if(departure != null) {
            let startY = i * ROW_HEIGHT;

            drawTrainInformation(ctx, pids, startY, i, ROW_HEIGHT, departure, isRowHidden);
            drawRouteInformation(ctx, pids, startY, i, ROW_HEIGHT, departure, isRowHidden);
        }
    }

    drawTextInformation(ctx, state, pids);

    Texture.create()
    .texture("jsblock:sncf/images/backgrounds/information_bottom_2.png")
    .size(pids.width, pids.height)
    .draw(ctx);

    SncfUtils.drawClock(ctx, pids, Timing.currentTimeMillis());
    SncfUtils.drawFrame(ctx, pids, 9.8, true);
}

function drawTrainInformation(ctx, pids, startY, index, ROW_HEIGHT, departure, isArrivalsHidden) {
    const routeInfo = TrainUtils.getRouteInfo(departure);
    const trainType = routeInfo.trainType;
    const trainNumber = routeInfo.trainNumber;

    let trainName = TrainUtils.findNameFromAlias(trainType) || "SNCF";
    let isAnAutocar = TrainUtils.isMatchingOneAliasOfType(trainName, TRAIN_TYPES.CAR);

    let remainingHeight = isArrivalsHidden ? ROW_HEIGHT : ROW_HEIGHT - (8 * 0.5) - 1;

    let trainNamePixelSize = 0.28;
    let trainNumberPixelSize = 0.4;
    let trainTypeHeight = 10 * trainNamePixelSize + 7 * trainNumberPixelSize;
    let trainTypeStartY = startY + (remainingHeight - trainTypeHeight) / 2;

    let startX = 13;

    if(!isAnAutocar) {
        let trainIdentifier = TrainUtils.findTypeFromAlias(trainName) || TrainUtils.getType("SNCF");

        let trainTexture = trainIdentifier.texture || TrainUtils.getTextureOfType("SNCF");

        let iconWidth = trainTexture.size[0];
        let iconHeight = trainTexture.size[1];
        let trainTextureId = trainTexture.id || "blank";

        let showingTexture = TrainUtils.isShowingTexture(trainName);

        if(showingTexture) {
            Texture.create()
            .texture("jsblock:sncf/images/labels/" + trainTextureId + ".png")
            .pos((startX - iconWidth)/2, startY + (remainingHeight - iconHeight) / 2)
            .size(iconWidth, iconHeight)
            .draw(ctx);
        }
    }
    
    const delay = TrainUtils.getTrainDelay(departure);
    const timeLimitToShowDelay = 20; // seconds
    let showDelay = false;

    const onTimeMessages = ["À l'heure", "On time", "In orario"];
    let currentTime = Math.floor(Timing.currentTimeMillis() / 3000);
    let isOnTimeMessage = currentTime % 3 === 0;

    if (delay != null) {
        showDelay = delay.time > timeLimitToShowDelay;
    }

    if(isOnTimeMessage) {
        if(!isAnAutocar) {
            if(showDelay) {
                Text.create()
                .text("retard")
                .color(0xFEF103)
                .scale(0.32)
                .pos(startX, trainTypeStartY - 0.4)
                .draw(ctx);

                Text.create()
                .text(SncfUtils.formatTrainDelay(delay.time, false, false) + ".")
                .color(0xFEF103)
                .scale(0.32)
                .pos(startX, trainTypeStartY + 10 * 0.28)
                .draw(ctx);
            } else {
                Text.create()
                .text(onTimeMessages[currentTime % onTimeMessages.length])
                .color(0xFFFFFF)
                .scale(0.5)
                .leftAlign()
                .scaleXY()
                .size(25, 10)
                .pos(startX, startY + (remainingHeight - 8*0.5) / 2)
                .draw(ctx);
            }
        } else {
            Text.create()
            .text(trainNumber)
            .color(0xFFFFFF)
            .scale(trainNumberPixelSize)
            .bold()
            .pos(startX, trainTypeStartY + 10 * trainNamePixelSize)
            .draw(ctx);
        }
    } else {
        if(!isAnAutocar) {
            Text.create()
            .text(trainName)
            .color(0xFFFFFF)
            .scale(trainNamePixelSize)
            .pos(startX, trainTypeStartY)
            .draw(ctx);
        }

        Text.create()
        .text(trainNumber)
        .color(0xFFFFFF)
        .scale(trainNumberPixelSize)
        .bold()
        .pos(startX, trainTypeStartY + 10 * trainNamePixelSize)
        .draw(ctx);
    }
}

function drawRouteInformation(ctx, pids, startY, index, ROW_HEIGHT, departure, isArrivalsHidden) {
    let size = isArrivalsHidden ? 10 : 9;

    let remainingHeight = isArrivalsHidden ? ROW_HEIGHT : ROW_HEIGHT - (8 * 0.5) - 1;

    function getRemainingHeight(pxSize, height) {
        height = height || 8;
        return startY + (remainingHeight - (8 * pxSize)) / 2;
    }

    let departureTimePixelSize = 0.45;
    let destinationPixelSize = 0.575;

    const delay = TrainUtils.getTrainDelay(departure);

    /** ARRIVAL TIME */
    Text.create()
    .text(SncfUtils.formatTime(departure.arrivalTime() - (delay.time * 1000), "h"))
    .color(0xFEF103)
    .bold()
    .scale(departureTimePixelSize)
    .pos(31.75, getRemainingHeight(departureTimePixelSize, 6))
    .draw(ctx);

    Text.create()
    .text(SncfUtils.displayStationName(SncfUtils.shortenNames(departure.route().platforms[0].stationName == "" ? "⚠ Undefined Name" : ""+departure.route().platforms[0].stationName)))
    .color(0xFFFFFF)
    .scale(destinationPixelSize)
    .size(100, 9)
    .marquee()
    .pos(49.5, getRemainingHeight(destinationPixelSize))
    .draw(ctx);

    /** PLATFORM OF ARRIVAL */
    Text.create()
    .centerAlign()
    .text(departure.platformName().slice(0).split("|")[0])
    .color(0xFFFFFF)
    .scale(0.75)
    .size(size*0.75, size*0.75)
    .scaleXY()
    .pos(pids.width - (size * 0.725), startY + (isArrivalsHidden ? (ROW_HEIGHT - size) / 2 : size * 0.1) + size * 0.275)
    .draw(ctx);

    Texture.create()
    .texture("jsblock:sncf/images/pictograms/platform_border.png")
    .pos(pids.width - (size * 1.25), startY + (isArrivalsHidden ? (ROW_HEIGHT - size) / 2 : size * 0.1))
    .size(size, size)
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
    const delta = Timing.delta();
    if (scroll.timeInState == null) scroll.timeInState = 0;
    scroll.timeInState += delta;

    // Fonction par défaut pour getCharWidth (à déplacer dans SncfUtils.js si possible)
    function getCharWidth(char) {
        if (char === 't') return 2;
        if (char === 'i') return 1.5;
        if (char === 'l') return 1.25;
        return 2.5; // Valeur par défaut pour les autres lettres
    }

    switch (scroll.currentState) {
        case ScrollState.BEGIN:
            if (scroll.timeInState > TIME_BETWEEN_STATES) {
                scroll.currentState = ScrollState.SCROLLING;
                scroll.timeInState = 0;
            }
            break;
        case ScrollState.SCROLLING:
            const speed = 0.215 / (15 / 1000); // Vitesse calculée : 0.215 / (15 ms) = 14.333
            scroll.scrollOffset += speed * delta;
            while (scroll.scrollOffset >= (getCharWidth(scroll.stops[scroll.currentLetterIndex]) + 0.5)) {
                if (scroll.currentLetterIndex >= scroll.stops.length - MAX_VISIBLE_LETTERS) {
                    scroll.currentState = ScrollState.END;
                    scroll.timeInState = 0;
                    scroll.scrollOffset = 0;
                    break;
                } else {
                    scroll.scrollOffset -= (getCharWidth(scroll.stops[scroll.currentLetterIndex]) + 0.5);
                    scroll.currentLetterIndex++;
                }
            }
            break;
        case ScrollState.END:
            if (scroll.timeInState > TIME_BETWEEN_STATES) {
                scroll.currentState = ScrollState.BEGIN;
                scroll.timeInState = 0;
                scroll.scrollOffset = 0;
                scroll.currentLetterIndex = 0;
            }
            break;
    }
}

function drawStationList(ctx, scroll, pids, startY, index, ROW_HEIGHT, departure, isArrivalsHidden, isOdd) {
    scroll.stations = [];

    let platforms = departure.route().platforms;
    let stations = [];

    if(scroll.stations.length == 0) {
        for(let i = 0; i < platforms.length - 1; i++) { 
            stations.push({
                name: platforms[i].stationName == "" ? "⚠ Undefined Name" : SncfUtils.displayStationName(SncfUtils.shortenNames(""+platforms[i].stationName)),
                id: platforms[i].platformId
            }, {
                name: i == platforms.length - 2 ? "          " : " • ",
                id: "separator-" + i
            });
        }

        scroll.stations = stations;

        const currentStation = departure.platformId();
        let currentIndex = scroll.stations.findIndex(station => station.id === currentStation);

        if (currentIndex !== -1) {
            scroll.stations = scroll.stations.slice(currentIndex + 2);
        }
    }

    let margin = 0.2;
    let startX = 13;
    let maxY = startY + ROW_HEIGHT;
    scroll.stops = "";

    scroll.stations.forEach(stop => {
        scroll.stops += stop.name;
    });

    if(!isArrivalsHidden) {
        if(scroll.stops.length > MAX_VISIBLE_LETTERS) {
            handleScrollState(ctx, scroll, pids);
        }

        Text.create()
        .text(scroll.stops.substring(scroll.currentLetterIndex, scroll.currentLetterIndex + MAX_VISIBLE_LETTERS + 1))
        .color(0xFFFFFF)
        .leftAlign()
        .scale(0.5)
        .size(1.5, LETTER_HEIGHT)
        .pos(startX - scroll.scrollOffset, maxY - LETTER_HEIGHT - 1)
        .draw(ctx);

        let tex = isOdd ? "jsblock:sncf/images/backgrounds/station/arrival_odd.png" : "jsblock:sncf/images/backgrounds/station/arrivals_background.png";

        Texture.create()
        .texture(tex)
        .size(startX, ROW_HEIGHT)
        .pos(0, index * ROW_HEIGHT)
        .draw(ctx);

        Texture.create()
        .texture(tex)
        .size((startX * 1.65), ROW_HEIGHT)
        .pos(pids.width - (startX * 1.65), index * ROW_HEIGHT)
        .draw(ctx);
    }
}