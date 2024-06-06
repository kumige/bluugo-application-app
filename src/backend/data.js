import { query } from "express";
import { db } from "../../main.js";

/**
 * Fetches car rejections
 * @param {string} filterStr 
 * @param {number} limit 
 * @param {number} offset 
 * @param {function} callback 
 */
export function getData(filterStr, limit, offset, callback) {
  const splitFilter = filterStr.split(' ', 3);

  while (splitFilter.length < 3) {
    splitFilter.push('');
  }

  const queryTemplate = `
    SELECT
      model_year,
      make,
      model,
      rejection_percentage,
      reason_1,
      reason_2,
      reason_3
    FROM
      car_rejections
    WHERE
      make LIKE ? OR model LIKE ? OR model_year LIKE ?
  `;

  const finalQuery = 
    `
    ${queryTemplate}
    INTERSECT
    ${queryTemplate}
    INTERSECT
    ${queryTemplate}
    ORDER BY
      make ASC, model_year ASC, model ASC
    LIMIT ?
    OFFSET ?
  `;

  const params = [
    `%${splitFilter[0]}%`, `%${splitFilter[0]}%`, `%${splitFilter[0]}%`,
    `%${splitFilter[1]}%`, `%${splitFilter[1]}%`, `%${splitFilter[1]}%`,
    `%${splitFilter[2]}%`, `%${splitFilter[2]}%`, `%${splitFilter[2]}%`,
    limit, offset
  ];

  db.all(finalQuery, params, (err, rows) => {
    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });

}