export function mapToObject(map: Map<string, any>) {
    const obj = {};
    for (const [key, value] of map) {
        // @ts-ignore
        obj[key] = value instanceof Map ? mapToObject(value) : value;
    }
    return obj;
}
