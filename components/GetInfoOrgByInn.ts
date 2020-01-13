import request from 'request';
import $ from 'cheerio';
import {strTrim} from './strTrim'

export const GetInfoOrgByInn = (inn: number) => {

    //структура объекта{} информации об организации
    //название организации
    //ИНН
    //КПП
    //ОГРН
    //Адрес организации
    //фз44
    //фз223

    // request URL
    const url: string = `
        https://zakupki.gov.ru/epz/organization/chooseOrganization/chooseOrganizationTableModal.html?
        placeOfSearch=FZ_94
        &organizationType=ALL
        &noPlaceTitle=false
        &searchString=${inn}
        &page=1
    `;

    return new Promise((resolve, reject) => {
        request({
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive',
                'Host': 'zakupki.gov.ru',
                'Referer': 'https://zakupki.gov.ru/epz/order/extendedsearch/results.html',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            },
            uri: url,
            method: 'GET',
            gzip: true
        }, (err, res, body) => {
            if (err) reject(err);
            let org: [HTMLElement] = $('.wrapperTableHeight', body).children()[0];
            let getElements: Array<HTMLElement> = $('.rowOrganization', org).children();
            let resultArr: any[] = [];
            for (let i = 0; i < getElements.length; i++) {
                if ( i===1 || i===3 ) {
                    resultArr.push( strTrim($(getElements[i]).text()) );
                } else if ( i===2 ) {
                    let arr = $(getElements[i]).children();
                    for (let i = 0; i < arr.length; i++) {
                        resultArr.push( Number(strTrim($(arr[i]).text())) );
                    }
                } else if ( i===4 ) {
                    let arr = $(getElements[i]).children();
                    for (let i = 0; i < arr.length; i++) {
                        resultArr.push( strTrim($(arr[i]).text()) );
                    }
                }
            } //end for (let i = 0; i < getElements.length; i++)
            return resolve({...resultArr});
        }); //end request
    }); //end promise
} //end GetInfoOrgByInn