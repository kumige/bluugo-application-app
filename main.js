import express from 'express'
import { jsonUpload } from './src/backend/upload.js'
import { getData } from './src/backend/data.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3'

sqlite3.verbose()
const app = express()
const jsonParser = bodyParser.json({limit: '50mb'})

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const db = new sqlite3.Database('db')

//db.on('trace', (string => {
//    console.log('TRACE', string);
//}))

db.run(`
  CREATE TABLE IF NOT EXISTS car_rejections (
    id INTEGER PRIMARY KEY,
    model_year TEXT,
    make TEXT,
    model TEXT,
    rejection_percentage REAL,
    reason_1 TEXT,
    reason_2 TEXT,
    reason_3 TEXT
  )
`, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Table created or already exists.');
});

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname + '/src/frontend' })
})

app.post('/upload', jsonParser, async function (req, res) {
    const response = await jsonUpload(req)
    res.json(response);
})

app.get('/data', async function (req, res) {
    const filterString = req.query.q ? req.query.q : ''
    const data = await getData(filterString, 50, 0, (err, data) => {
        if (err) {
            console.error('Error:', err);
        } else {
            return res.json(data)
        }
    })
})

app.listen(3000)
console.log('listening to port 3000');