export function millisecondsToHuman(seconds){
    const minutes = (Math.floor(seconds / 60) + "").padStart(2, '0');
    const newSeconds = (seconds % 60 + "").padStart(2, '0');
    return `${minutes}:${newSeconds}`;
}

export function getDateNow(){
    return (new Date()).toISOString();
}

export function getDateFormat(date){
    const dateObj = new Date(date);
    return `${dateObj.getDate() + 1}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes().toString().padStart(2, '0')}`
}