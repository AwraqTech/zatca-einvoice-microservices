export default function signingTime() {
    const timestamp = new Date();

    const padZero = (num: number) => num.toString().padStart(2, '0');

    const year = timestamp.getFullYear();
    const month = padZero(timestamp.getMonth() + 1);
    const day = padZero(timestamp.getDate());
    const hours = padZero(timestamp.getHours());
    const minutes = padZero(timestamp.getMinutes());
    const seconds = padZero(timestamp.getSeconds());

    const formattedTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    return formattedTimestamp;

};