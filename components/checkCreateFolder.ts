import * as fs from 'fs';
import {dateToday, timeNow, getDayWeek, getMonth, getDayNumber, getYear} from '../components/dateToday';

export function checkCreateFolder(): string { 
  //folder year
  const dirYear: string = `./orders/${getYear()}`;
  if (!fs.existsSync(dirYear)) {
    //check folder year, create if no have
    fs.mkdirSync(dirYear);
  }

  //folder month
  const dirMonth: string = `${dirYear}/${getMonth()}`;
  if (!fs.existsSync(dirMonth)) {
    //check folder month, create if no have
    fs.mkdirSync(dirMonth);
  }

  //folder day
  const dirDayName: string = `${dirMonth}/${getDayNumber()} ${getDayWeek()}`;
  if (!fs.existsSync(dirDayName)) {
    //check folder day, create if no have
    fs.mkdirSync(dirDayName);
  }

  return dirDayName;
}