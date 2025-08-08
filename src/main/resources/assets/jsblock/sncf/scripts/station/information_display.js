include(Resources.id("jsblock:scripts/pids_util.js"));

include(Resources.id("jsblock:sncf/scripts/utils/sncf_utils.js"));
include(Resources.id("jsblock:sncf/scripts/utils/trains_types.js"));
include(Resources.id("jsblock:sncf/scripts/utils/warning_manager.js"));

const totalHeight = 68.6;

const MAX_VISIBLE_LINES = 14;
const LINE_HEIGHT = 5;
const TIME_BETWEEN_STATES = 7;

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
        currentLineIndex: 0,
        isTextNull: true,
        lines: [],
        text: [],
        scrollOffset: 0,
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

    Texture.create()
    .texture("jsblock:sncf/images/backgrounds/information_background.png")
    .size(pids.width, pids.height)
    .draw(ctx);

    if(pids.arrivals().get(0) != null || pids.arrivals().get(0) == null) {
        let text = state.scroll.text;
        if(text.length != 0) text = [], state.scroll.lines = [];

        for(let i = 0; i < 4; i++) {
            if(pids.getCustomMessage(i) != "") text.push(""+pids.getCustomMessage(i));
            else text.push("");
        }

        drawTextInformation(ctx, state, pids, text);
        drawHeaderAndFooter(ctx, pids);

        SncfUtils.drawClock(ctx, pids, Date.now());
        SncfUtils.drawFrame(ctx, pids, 9.8, true);
    }
}

function dispose(ctx, state, pids) {}

function drawHeaderAndFooter(ctx, pids) {
    Texture.create()
    .texture("jsblock:sncf/images/backgrounds/information_header.png")
    .size(pids.width, pids.height)
    .draw(ctx);

    Texture.create()
    .texture("jsblock:sncf/images/backgrounds/information_bottom_2.png")
    .size(pids.width, pids.height)
    .draw(ctx);
}

function drawTextInformation(ctx, state, pids, text) {

    let lines = splitSentences(text);
    state.scroll.lines = lines;
    let scroll = state.scroll;

    let maxI = lines.length > MAX_VISIBLE_LINES ? MAX_VISIBLE_LINES : lines.length;
    let startY = 7.5;

    if(lines.length > MAX_VISIBLE_LINES) handleScrollState(ctx, scroll, pids);

    for (let i = 0; i < maxI; i++) {
        Text.create()
        .text(lines[i + scroll.currentLineIndex])
        .color(0x00357A)
        .leftAlign()
        .scale(0.45)
        .size(200, LINE_HEIGHT)
        .pos(59, startY + (i * (LINE_HEIGHT + 0.5)) - scroll.scrollOffset)
        .draw(ctx);
    }

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
            const speed = 2.4; // 0.06 / (25 / 1000)
            scroll.scrollOffset += speed * delta;
            while (scroll.scrollOffset >= (LINE_HEIGHT + 0.5)) {
                if (scroll.currentLineIndex >= scroll.lines.length - (MAX_VISIBLE_LINES + 1)) {
                    scroll.currentState = ScrollState.END;
                    scroll.timeInState = 0;
                    break;
                } else {
                    scroll.currentLineIndex++;
                    scroll.scrollOffset -= (LINE_HEIGHT + 0.5);
                }
            }
            break;
        case ScrollState.END:
            if (scroll.timeInState > TIME_BETWEEN_STATES) {
                scroll.currentState = ScrollState.BEGIN;
                scroll.timeInState = 0;
                scroll.scrollOffset = 0;
                scroll.currentLineIndex = 0;
            }
            break;
    }
}

function splitSentences(textArray, maxLength) {
    maxLength = maxLength || 30;
    const result = [];
    
    textArray.forEach((sentence, index) => {
        if (sentence === "") return;
        
        if (sentence.length <= maxLength) {
            result.push(sentence);
        } else {
            const words = sentence.split(" ");
            let currentLine = "";
            
            for (let word of words) {
                if ((currentLine + (currentLine ? " " : "") + word).length <= maxLength) {
                    currentLine += (currentLine ? " " : "") + word;
                } else {
                    if (currentLine) result.push(currentLine);
                    currentLine = word;
                }
            }
            if (currentLine) result.push(currentLine);
        }
        
        if (index < textArray.length - 1 && textArray.slice(index + 1).some(s => s !== "")) {
            result.push(" ");
        }
    });

    result.push(" ", " ", " ");
    
    return result;
}