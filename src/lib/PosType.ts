export type Position = {
    coords: {
        latitude: number;
        longitude: number;
        altitude: number|null;
    },
    timestamp: number;
}

export type PositionError = {
    code: number;
    message: string;
}