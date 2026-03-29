declare function include(path: string): void;

declare namespace Resources {
    function id(path: string): string;
    function getAddonVersion(addon: string): string;
}

declare namespace Timing {
    function currentTimeMillis(): number;
    function delta(): number;
    function elapsed(): number;
}

interface PIDSScriptContext {
    setDebugInfo(key: string, value: any): void;
}

interface Matrices {
    push(): void;
    pop(): void;
    translate(x: number, y: number, z: number): void;
    scale(x: number, y: number, z: number): void;
    rotateX(angle: number): void;
    rotateY(angle: number): void;
    rotateZ(angle: number): void;
}

interface TextWrapper {
    pos(x: number, y: number): TextWrapper;
    size(w: number, h: number): TextWrapper;
    text(str: string): TextWrapper;
    scale(i: number): TextWrapper;
    leftAlign(): TextWrapper;
    centerAlign(): TextWrapper;
    rightAlign(): TextWrapper;
    shadowed(): TextWrapper;
    italic(): TextWrapper;
    bold(): TextWrapper;
    stretchXY(): TextWrapper;
    scaleXY(): TextWrapper;
    wrapText(): TextWrapper;
    marquee(): TextWrapper;
    fontMC(): TextWrapper;
    matrices(matrices: Matrices): TextWrapper;
    font(id: string): TextWrapper;
    color(color: number | string): TextWrapper;
    draw(ctx: PIDSScriptContext): void;
}

declare const Text: {
    create(comment?: string): TextWrapper;
};

interface TextureWrapper {
    pos(x: number, y: number): TextureWrapper;
    size(w: number, h: number): TextureWrapper;
    texture(id: string): TextureWrapper;
    color(color: number | string): TextureWrapper;
    uv(u2: number, v2: number): TextureWrapper;
    uv(u1: number, v1: number, u2: number, v2: number): TextureWrapper;
    matrices(matrices: Matrices): TextureWrapper;
    draw(ctx: PIDSScriptContext): void;
}

declare const Texture: {
    create(comment?: string): TextureWrapper;
};

interface CarDetails {
    getVehicleId(): string;
    getOccupancy(): number;
}

interface SimplifiedRoutePlatform {
    getPlatformId(): number;
    getStationId(): number;
    getStationName(): string;
    getDestination(): string;
}

interface SimplifiedRoute {
    getName(): string;
    getId(): number;
    getColor(): number;
    getCircularState(): any;
    getPlatforms(): SimplifiedRoutePlatform[];
}

interface Platform {
    routes: SimplifiedRoute[];
    routeColors: number[];
    getName(): string;
    getId(): number;
    getDwellTime(): number;
}

interface ArrivalWrapper {
    destination(): string;
    arrivalTime(): number;
    departureTime(): number;
    deviation(): number;
    realtime(): boolean;
    departureIndex(): number;
    terminating(): boolean;
    route(): SimplifiedRoute | null;
    routeId(): number;
    routeName(): string;
    routeNumber(): string;
    routeColor(): number;
    circularState(): any;
    platform(): Platform;
    platformId(): number;
    platformName(): string;
    carCount(): number;
    cars(): CarDetails[];
}

interface ArrivalsWrapper {
    get(i: number): ArrivalWrapper | null;
    mixedCarLength(): boolean;
    platforms(): Platform[];
    size(): number;
}

interface Station {}

interface PIDSWrapper {
    type: string;
    width: number;
    height: number;
    rows: number;
    isRowHidden(i: number): boolean;
    getCustomMessage(i: number): string;
    isPlatformNumberHidden(): boolean;
    station(): Station | null;
    arrivals(): ArrivalsWrapper;
}