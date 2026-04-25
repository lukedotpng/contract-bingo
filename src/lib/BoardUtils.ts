export function GenerateSeed(length: number) {
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&";

    let seed = "";
    for (let i = 0; i < length; i++) {
        seed += chars[Math.floor(Math.random() * chars.length)];
    }
    return seed;
}
