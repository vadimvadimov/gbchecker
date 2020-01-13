//формируем ссылку по полному навзанию организации и ИНН
export function makeUrl(org: {}, settings: any): string {

  const {pageNumber, ordersOnPage, af, ca, pc, pa} = settings;
  const nameOrg: string = encodeURI(org[Object.keys(org)[0]]); //название организации
  const innOrg: number = org[Object.keys(org)[1]]; //инн организации

  return `https://zakupki.gov.ru/epz/order/extendedsearch/results.html?searchString=&morphology=on
  &search-filter=+%D0%94%D0%B0%D1%82%D0%B5+%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D1%8F
  &pageNumber=${pageNumber}&sortDirection=false&recordsPerPage=_${ordersOnPage}
  &showLotsInfoHidden=false
  &fz44=on
  &fz223=on
  &sortBy=PUBLISH_DATE
  &okpd2Ids=
  &okpd2IdsCodes=
  ${af}
  ${ca}
  ${pc}
  ${pa}
  &placingWaysList=
  &placingWaysList223=
  &placingChildWaysList=
  &publishDateFrom=+
  &publishDateTo=
  &applSubmissionCloseDateFrom=+
  &applSubmissionCloseDateTo=
  &priceFromGeneral=
  &priceFromGWS=
  &priceFromUnitGWS=
  &priceToGeneral=
  &priceToGWS=
  &priceToUnitGWS=
  &currencyIdGeneral=-1
  &customerTitle=${nameOrg}
  &customerCode=
  &customerFz94id=
  &customerFz223id=
  &customerInn=${innOrg}&orderPlacement94_0=
  &orderPlacement94_1=
  &orderPlacement94_2=
  &contractStageList_0=on
  &contractStageList_1=on
  &contractStageList_2=on
  &contractStageList_3=on
  &contractStageList=0%2C1%2C2%2C3&npaHidden=&restrictionsToPurchase44=`;
}