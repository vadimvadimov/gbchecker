export function dateToday(): string {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export function getYear() {
  const today = new Date();
  const yyyy = today.getFullYear();
  return yyyy;
}

export function getDayNumber() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  return dd;
}

export function getMonth() {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  switch(mm) {
    case '01':
      return `Январь`//январь;
    case '02':
      return `Февраль`//Февраль;
    case '03':
      return `Март`//Март;
    case '04':
      return `Апрель`//Апрель;
    case '05':
      return `Май`//Май;
    case '06':
      return `Июнь`//Июнь;
    case '07':
      return `Июль`//Июль;
    case '08':
      return `Август`//Август;
    case '09':
      return `Сентябрь`//Сентябрь;
    case '10':
      return `Октябрь`//Октябрь;
    case '11':
      return `Ноябрь`//Ноябрь;
    case '12':
      return `Декабрь`//Декабрь;
  }
}

export function timeNow(): string {
  const todayDate = new Date();
  return `${todayDate.getHours()}:${todayDate.getMinutes().toString().length<2?'0'+todayDate.getMinutes():todayDate.getMinutes()}`;
}

export function getDayWeek(): string {
  const date: Date = new Date();
  const getDay: number = date.getDay();
  //The getDay() method is used to get the day of the week of a given date according to local time.
  //The value returned by getDay() method is an integer corresponding to the day of the week:
  // 0 for Sunday, 1 for Monday, 2 for Tuesday, 3 for Wednesday, 4 for Thursday, 5 for Friday, 6 for Saturday.
  switch(getDay) {
    case 0:
      return `Воскресенье`//воскресенье;
    case 1:
      return `Понедельник`//понедельник;
    case 2:
      return `Вторник`//вторник;
    case 3:
      return `Среда`//среда;
    case 4:
      return `Четверг`//четверг;
    case 5:
      return `Пятница`//пятница;
    case 6:
      return `Суббота`//суббота;
  }
}