import * as fs from 'fs';

export const RecInfoOrgDB = (org: {},  orgs: {}[] ): any => {
    return new Promise((resolve, reject) => {
        orgs.push(org);
        let arr = [...new Set(orgs.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));
        fs.writeFile('../DB/orgs.json', JSON.stringify({"orgs":arr}, null, 2), err => {
            if (err) {
                return reject(err);
            }
            return resolve(true);
        });
    })
}