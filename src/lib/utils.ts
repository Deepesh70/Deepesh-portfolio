// to clamp a number between min & max

export function clamp(value: number, min:number, max: number): number {
    return Math.min(Math.max(value,min),max);
}


export { nanoid as generateId } from "nanoid";