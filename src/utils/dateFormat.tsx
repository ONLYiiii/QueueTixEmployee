function insert(main_string: string, ins_string: string, pos: number) {
    return main_string.slice(0, pos) + ins_string + main_string.slice(pos);
}

export function dateFormat(date: Date): string {
    return insert(date.toDateString(), ",", 3);
}

export function getFullDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
}

export function getFullTime(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
        seconds < 10 ? `0${seconds}` : seconds
    }`;
}
