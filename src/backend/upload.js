import { db } from "../../main.js";

/**
 * Uploads json data to database
 * @param {Request} req 
 * @returns 
 */
export async function jsonUpload(req) {
    if (req.body == null) {
        throw new Error('no file in body')
    }

    const [existingRows, newRows] = await checkRows(req.body)

    insertNewRows(formatJsonForInsert(newRows))
    updateExistingRows(formatJsonForUpdate(existingRows))

    return { status: 'ok', statusCode: '201' }
}

/**
 * Checks whether the JSON objects exist in the database and separates them from new objects
 * @param {JSON} data 
 * @returns [existingRows: JSON, newRows: JSON]
 */
async function checkRows(data) {
    let existingRows = []
    let newRows = []
    let preparedStatement = db.prepare(`
        SELECT 
          *
        FROM
          car_rejections
        WHERE
          model_year = ?
        AND
          make = ?
        AND
          model = ?
    `);

    const checkRow = (row) => {

        // Have to do this promise stuff because sqlite3 works with callbacks and this must finish before updating or inserting new rows
        return new Promise((resolve, reject) => {
            preparedStatement.get([row.model_year, row.make, row.model], (err, result) => {
                if (err) {
                    console.error(err.message);
                    return reject(err);
                }
                if (result) {
                    existingRows.push(row);
                } else {
                    newRows.push(row);
                }
                resolve();
            });
        });
    };

    await Promise.all(data.map(row => checkRow(row)));

    return [existingRows, newRows]
}

/**
 * Inserts new rows to database
 * @param {Array} data 
 */
function insertNewRows(data) {
    if (data.length > 0) {

        let preparedStatement = db.prepare(`
        INSERT INTO car_rejections (model_year, make, model, rejection_percentage, reason_1, reason_2, reason_3)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

        data.forEach(row => {
            preparedStatement.run(row, (err) => {
                if (err) {
                    console.error(err.message);
                }
            });
        });


        console.log('inserted ' + data.length + ' rows');
    }

}
/**
 * Updates existing rows in database
 * @param {Array} data 
 */
function updateExistingRows(data) {
    if (data.length > 0) {

        let preparedStatement = db.prepare(`
        UPDATE car_rejections
        SET 
          rejection_percentage = ?,
          reason_1 = ?,
          reason_2 = ?,
          reason_3 = ?
        WHERE
          model_year = ?
        AND
          make = ?
        AND  
          model = ?  
    `);

        data.forEach(row => {
            preparedStatement.run(row, (err) => {
                if (err) {
                    console.error(err.message);
                }
            });
        });

    }

}

/**
 * Formats json array to suitable form for db update
 * @param {JSON[]} json 
 * @returns Array
 */
function formatJsonForUpdate(json) {
    return json.map(item => {
        return [
            item.rejection_percentage ? item.rejection_percentage : '',
            item.reason_1 ? item.reason_1 : '',
            item.reason_2 ? item.reason_2 : '',
            item.reason_3 ? item.reason_3 : '',
            item.model_year ? item.model_year : '',
            item.make ? item.make : '',
            item.model ? item.model : '',
        ]
    })
}


/**
 * Formats json array to suitable form for db insert
 * @param {JSON[]} json 
 * @returns Array
 */
function formatJsonForInsert(json) {
    return json.map(item => {
        return [
            item.model_year ? item.model_year : '',
            item.make ? item.make : '',
            item.model ? item.model : '',
            item.rejection_percentage ? item.rejection_percentage : '',
            item.reason_1 ? item.reason_1 : '',
            item.reason_2 ? item.reason_2 : '',
            item.reason_3 ? item.reason_3 : '',
        ]
    })
}
