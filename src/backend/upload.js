import { db } from "../../main.js";
/**
 * @typedef req Request
 * @param {*} req 
 */
export async function jsonUpload(req) {
    if (req.body == null) {
       throw new Error('no file in body') 
    }

    

    let values = formatJsonForDb(req.body);
    
    let preparedStatement = db.prepare(`
        INSERT INTO car_rejections (model_year, make, model, rejection_percentage, reason_1, reason_2, reason_3)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    values.forEach(row => {
        preparedStatement.run(row, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    });

    preparedStatement.finalize()
    console.log('inserted ' + values.length + ' rows');
    return { status: 'ok', statusCode: '201'}
}

function formatJsonForDb(json) {
    return json.map(item => {
        console.log(item);
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
