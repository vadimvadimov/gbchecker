export default function timeNow():string {
    const todayDate = new Date();
    return `${todayDate.getHours()} ${todayDate.getMinutes()} ${todayDate.getSeconds()}`;
}