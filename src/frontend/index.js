async function uploadFile() {
    const file = document.getElementById('myFile').files[0]
    const error = document.getElementById('fileError')
    if (file) {
        error.className = 'error hidden'

        const res = await fetch('upload', { method: 'POST', body: file })
        console.log(res);
        if (res.status == 200) {
            alert('File uploaded succesfully')
            getData()
        } else alert('Something went wrong')

    } else {
        error.className = 'error visible'
    }
}

async function getData(event) {
    const res = await fetch('/data?' + new URLSearchParams({ q: event ? event.target.value : '' }))
    const table = document.getElementById('myTable')
    updateTable(table, await res.json())
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