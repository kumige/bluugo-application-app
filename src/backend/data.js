import { db } from "../../main.js";

export function getData(filterStr, start, offset, callback) {
  /*
  const query = `
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
      make LIKE ? OR make LIKE ? OR make LIKE ? OR 
      model LIKE ? OR model LIKE ? OR model LIKE ? OR 
      model_year LIKE ? OR model_year LIKE ? OR model_year LIKE ?
    ORDER BY
      make ASC, model_year ASC, model ASC
    LIMIT ?
    OFFSET ?
`;
*/
  let test = filterStr.split(' ', 3)

  console.log('test', test);
  // Ensure test array always has 3 elements

  // Construct the individual SELECT statements
  const queryParts = [];
  const params = [];



  for (const word of test) {
    if (word || word === test[0]) {
      queryParts.push(`
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
        make LIKE ? AND model LIKE ? AND model_year LIKE ?
    `);
      if (word == test[0]) {

        params.push(`%${word || '%'}%`, `%${'%'}%`, `%${'%'}%`);
      }
      if (word == test[1]) {

        params.push(`%%%`, `%${word}%`, `%${'%'}%`);
      }
      if (word == test[2]) {

        params.push(`%${'%'}%`, `%${'%'}%`, `%${word}%`);
      }

    }
  }

  // Combine the individual queries using UNION
  const finalQuery = queryParts.join(' INTERSECT ') + `
    ORDER BY
      make ASC, model_year ASC, model ASC
    LIMIT ?
    OFFSET ?
      `;

  // Add limit and offset to the params array
  params.push(offset, start);

  console.log('test', test);
  /*const params = [
    `%${test[0]}%`, `%${test[0]}%`, `%${test[0]}%`,
    `%${test[1]}%`, `%${test[1]}%`, `%${test[1]}%`,
    `%${test[2]}%`, `%${test[2]}%`, `%${test[2]}%`,
    offset, start
  ];*/

  console.log('params', params);
  //console.log('query', query);

  db.all(finalQuery, params, (err, rows) => {
    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      console.log('rows[0]', rows[0]);
      console.log('length', rows.length);
      callback(null, rows);
    }
  });

}