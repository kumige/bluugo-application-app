function uploadFile() {
    const file = document.getElementById('myFile').files[0]
    console.log('uploadFile', file);
    fetch('upload', { method: 'POST', body: file })
}

async function getData() {
    const res = await fetch('/data')
    const data = await res.json()
    const table = document.getElementById('myTable')
    updateTable(table, data)
}

function updateTable(table, data) {
    let tableHTML = `
        <tr>
            <td class="tr-header"> Model year </td>
            <td class="tr-header"> Make </td>
            <td class="tr-header"> Model </td>
            <td class="tr-header"> Rejection % </td>
            <td class="tr-header"> Reason 1 </td>
            <td class="tr-header"> Reason 2 </td>
            <td class="tr-header"> Reason 3 </td>
        </tr>

   `
    data.forEach(item => {
        const tableRow = `
            <tr>
                <td> ${item.model_year} </td>
                <td> ${item.make} </td>
                <td> ${item.model} </td>
                <td> ${item.rejection_percentage} </td>
                <td> ${item.reason_1} </td>
                <td> ${item.reason_2} </td>
                <td> ${item.reason_3} </td>
            </tr>
        `
       tableHTML = tableHTML.concat(tableRow) 
    });    

    table.innerHTML = tableHTML
}

window.onload = getData()