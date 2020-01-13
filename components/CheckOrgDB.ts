export const CheckOrgDB = (inn: number, orgs: any[]): any => {
    return new Promise(resolve => {
        orgs.forEach((elem: {}) => {
            if (elem[Object.keys(elem)[1]] === inn) {
                return resolve(elem);
            }
        });
        return resolve(false);
    });
}