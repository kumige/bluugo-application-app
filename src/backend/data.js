import { db } from "../../main.js";

export function getData(filterStr, start, offset, callback) {
    const query = `
    SELECT
      *
    FROM
      car_rejections
    WHERE
      make LIKE ? OR model LIKE ?
    LIMIT ?
    OFFSET ?
  `;
    const params = [`%${filterStr}%`, `%${filterStr}%`, offset, start];

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err);
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });

}