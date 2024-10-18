'use strict';

// Get a list of items in inventory based on the classification_id
let classificationList = document.querySelector("#classificationSelect");
classificationList.addEventListener("change", function () {
    let classification_id = classificationList.value;
    console.log(`classification_id is: ${classification_id}`);

    let classIdURL = "/inv/getInventory/" + classification_id;
    fetch(classIdURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            console.log(data);
            buildInventoryList(data);
        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message);
        });
});

// Function to build the inventory list
function buildInventoryList(data) {
    const inventoryTable = document.getElementById("inventoryDisplay");

    // Clear the existing table content
    inventoryTable.innerHTML = '';

    // Create table headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    
    // Assuming data has fields: id, name, classification, etc.
    const headers = ["ID", "Name", "Classification", "Quantity"]; // Add any other relevant headers
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    inventoryTable.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");
    
    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.classification}</td>
            <td>${item.quantity}</td>
        `; // Modify based on your actual data structure
        tbody.appendChild(row);
    });
    
    inventoryTable.appendChild(tbody);
}
// Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) { 
    let inventoryDisplay = document.getElementById("inventoryDisplay"); 
    
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 

    // Set up the table body 
    dataTable += '<tbody>'; 
    
    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) { 
        console.log(element.inv_id + ", " + element.inv_model); 
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
    }); 
    
    dataTable += '</tbody>'; 

    // Display the contents in the Inventory Management view 
    inventoryDisplay.innerHTML = dataTable; 
}
