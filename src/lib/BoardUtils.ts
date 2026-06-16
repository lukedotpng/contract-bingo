export function GenerateSeed(length: number) {
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&";

    let seed = "";
    for (let i = 0; i < length; i++) {
        seed += chars[Math.floor(Math.random() * chars.length)];
    }
    return seed;
}

export function IndexToPositionString(index: number, boardSize: number) {
    if (index >= boardSize ** 2) {
        return "";
    }
    const letters = ["A", "B", "C", "D", "E"];
    const letter = letters[Math.floor(index / boardSize)];
    const number = (index % boardSize) + 1;
    return letter + number;
}
