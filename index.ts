import request from 'request';
import $ from 'cheerio';
import * as fs from 'fs';
import * as orgs from './DB/orgs.json';
import {strTrim} from './components/strTrim';
import {CheckOrgDB} from './components/CheckOrgDB';
import {GetInfoOrgByInn} from './components/GetInfoOrgByInn';
import {RecInfoOrgDB} from './components/RecInfoOrgDB';
import {dateToday, timeNow} from './components/dateToday';
import {config} from './config/settings';
import {makeUrl} from './components/makeUrl';
import {checkCreateFolder} from './components/checkCreateFolder';


//nodemailer for send email

//check, if not have create folder for orders: year, month, today
//проверяем есть ли папка года, месяца, дня. создаем если нету. получаем название папки сегодняшнего дня
const getDayName: string = checkCreateFolder();

const arrInn: number[] = [
  5447101872,
  5452114034,
  5452113560
];

//array orgs from DB
//список организаций из БД
const arrOrgs: {}[] = orgs.orgs;

//return all orders by inn
//все заказы по ИНН
let ordersOrg: any[] = [];

//setting for make search string
//настройки для формирования поисковой строки
let settings: {} = config;

//start search orders by first Inn from arrTnn
//начинаем поиск заказов по первому ИНН из списка
goNextInn(0);

//variable for next index Inn from arrInn
let nextIndexInn: number;

//get todayDay
const _dateNow = new Date(dateToday());

function goNextInn(indexInn: number) {
  //start search func
  settings['pageNumber'] = 1;
	ordersOrg = [];
  
  //если последний индекс в массиве заканчиваем
  nextIndexInn = indexInn + 1;
	if (nextIndexInn > arrInn.length) {
		return;
	}
	
	console.log(`nextIndexInn `, nextIndexInn);
	//check next inn in arr
	let currentInn = arrInn[indexInn];

	CheckOrgDB(currentInn, arrOrgs)
		.then(checkedOrg => checkedOrg ?
			(
        console.log(`Организация уже есть в БД\n`, checkedOrg),
        FindOrders(checkedOrg, settings)
			) : (
				GetInfoOrgByInn(currentInn)
					.then(orgInfo => 
						RecInfoOrgDB(orgInfo, arrOrgs)
							.then(async result => {
								console.log(result?`Добавлена организация:\n`:``, orgInfo),
								FindOrders(checkedOrg, settings)
							})
					)
			)
		)
}

function FindOrders(org: {}, settings: {}): any {
  findOrdersOnPage(org, settings)
    .then(orders => {
      if (orders.length && typeof orders[0] !== 'number') {
        //orders on only 1 page or last page
        //заказы только на одной странице или на последней
        //возвращает массив с всеми заказми заказами
        ordersOrg.push(...orders);
        //ordersOrg.unshift();
        console.log(`ordersOrg.end`, ordersOrg[0].end);
        const _day = ordersOrg[0].end[0];
        const _month = ordersOrg[0].end[1];
        const _year = ordersOrg[0].end[2];
        const _endDate = new Date(`${_month}/${_day}/${_year}`); 
        //day left for order end
        const _daysLeft = Math.ceil((_endDate.getTime() - _dateNow.getTime()) / (1000 * 3600 * 24));
        console.log(`Осталось дней `, _daysLeft);
        //let year = objectEndDate[2];
        //let month = objectEndDate[1];
        //let day = objectEndDate[0];
        //let date = new Date(today);
        //let endDate = new Date(`${month}/${day}/${year}`); 
        //let daysLeft = (endDate - date) / (1000 * 3600 * 24);
        for (let order of ordersOrg) {
          order.daysLeft = _daysLeft;
        }

        // writeFile function with filename, content and callback function
        fs.writeFile(`${getDayName}/${org[Object.keys(org)[1]]}.json`, JSON.stringify({"orders":ordersOrg}, null, 2), function (err) {
          if (err) throw err;
          console.log('File is created successfully.');
        });

        return console.log(ordersOrg[0]), goNextInn(nextIndexInn);
      } else if (orders.length && typeof orders[0] === 'number') {
        //orders on 2 or more page
        //заказы на 2х и более страницах
        //добавляет заказы со страницы в общий массив заказов ordersOrg[] продолжает поиск заказов на страницах
        settings['pageNumber'] = orders[0];
        orders.shift();
        ordersOrg.push(...orders);
				FindOrders(org, settings);
      } else {
        //if no orders on page
        //нету заказов
        //return clear array and run find next inn
        //возвращает пустой массив и запускает функцию поиска след. ИНН
        return ordersOrg = [], console.log(ordersOrg.length), goNextInn(nextIndexInn);
      }
    });
}

function findOrdersOnPage(org: {}, settings: any): Promise<{}[]> {
  /*let order: {} = {
      type: '',//example 44-ФЗ Электронный аукцион                            
      number: 0,//0351200012219000279 replace № ""                                
      orderUrl: '',//ссылка на заказ                                              
      status: '',//подача заявок, работа комиссии                                   
      description: '',//Оказание услуг по сбору, транспортировке и обеспечению...    
      client: '',//куйбышевская црб                                                 
      clientUrl: '',//ссылка на заказчика                                            
      price: '',//начальная цена                                                    
      added: [],// добавлено                                                                
      end: []// окончание                                                            
  }*/
  //локальный список заказов на странице
  const orders: {}[] = [];
  let activePage: number = 0;
  let nextPage: number = 0;

  //settings['pageNumber'] = page;
  const url: string = makeUrl(org, settings);

  return new Promise((resolve, reject) => {
    request({
      headers: {
        'Referer': 'https://zakupki.gov.ru/epz/main/public/home.html',
        'Sec-Fetch-User': 1,
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'
      },
        uri: url,
        method: 'GET'
      }, (err, res, body) => {
        if (err) reject(new Error(err));
               
        //get orders on page
        //получение список заказов на странице
        const getOrdersOnPage: HTMLElement[] = $('.search-registry-entrys-block', body).children();
        
        if(!getOrdersOnPage.length) {
          //если нету заказов на странице возвращаем пустой массив orders
          return resolve(orders);
        }

        console.log(`Items on page: ${getOrdersOnPage.length}`);
        console.log(`Всего записей: ${strTrim($('.search-results__total',body).text())}`);
        //console.log(`Сегодня: ${dateToday()}`);
        //console.log(`Время: ${timeNow()}`);

        if ($('.page__link_active', body).length) {
          //find active page link

          activePage = Number(strTrim($('.page__link_active', body).text()));
          console.log('Текущая страница ', activePage);

          let activePages = $('.page__link', body).children();
          for (let page of activePages) {
            let numberPage = Number($(page).text());
            if ( activePage < numberPage) {
              nextPage = activePage + 1;
              //console.log(`Есть следующая страница`, numberPage);
              //console.log(`set nextPage `, nextPage);                           
              break;
            }
            //console.log(Number($(page).text()));
          }
        }
        for (let i = 0; i < getOrdersOnPage.length; i++) {
          //проверяем совпадает ли название орг на странице с названием из БД
          if ( strTrim($('.registry-entry__body-href a', getOrdersOnPage[i]).text()) === org[Object.keys(org)[0]] ) {
            let element = getOrdersOnPage[i];
            //формируем заказ в виде объекта
            let order = {
              //тип ф43 ф223
              type: strTrim($('.registry-entry__header-top__title', element).text()).replace(/\s+/g, ' '),
              //номер заказа
              number: Number(strTrim($('.registry-entry__header-mid__number a', element).text().replace('№', ''))),
              //ссылка на заказ
              orderUrl: strTrim($('.registry-entry__header-mid__number a', element).attr('href')).indexOf('https') != -1 ?
                (
                $('.registry-entry__header-mid__number a', element).attr('href')
                ) : (
                'https://zakupki.gov.ru' + $('.registry-entry__header-mid__number a', element).attr('href')
                ),
              //статус
              status: strTrim($('.registry-entry__header-mid__title', element).text()),
              //описание заказа
              description: strTrim($('.registry-entry__body-value', element).text()),
              //название организации заказчика
              client: strTrim($('.registry-entry__body-href a', element).text()),
              //Ссылка на организацию заказчика
              clientUrl: strTrim($('.registry-entry__body-href a', element).attr('href')).indexOf('https') != -1 ?
                (
                $('.registry-entry__body-href a', element).attr('href')
                ) : (
                'https://zakupki.gov.ru' + $('.registry-entry__body-href a', element).attr('href')
                ),
              //сумма заказа
              price: strTrim($('.price-block__value', element).text()),
              //дата добавления
              added: $($('.data-block', element).children()[1]).text().match(/\d+/gi),
              //дата окончания
              end: $($('.data-block', element).children()[$('.data-block', element).children().length-1]).text().match(/\d+/gi)
            }
            //добавляем заказ в общий список заказов
            orders.push(order);
          }
        }
        if (orders.length && nextPage > 1) {
					//add first number next page if he has
          orders.unshift(nextPage);
        }
        //array orders
        //возвращаем список заказов
        return resolve(orders); 
      })//end request
  });//end return new promise
}
