console.log("Render-grid");

function createElement(tagName, className, content) {
    const element = document.createElement(tagName);
    element.className = className;
     if (content) {
        element.innerHTML = content;
    }

    return element;
}


  function renderGrid(data, headers, renderTo){
    const grid = createElement('div', "basic-grid");
    let row, cell;
    const order = {
        asc: '▲', 
        desc: '▼' 
    };

    document.querySelector(renderTo).innerHTML = '';
  
    row = createElement('div', "grid-row grid-head");
    grid.appendChild(row);
  
    for (const header of headers){
        cell = createElement('div', `grid-cell `, header.text);
        cell.style.width = header.width ? header.width : '100%';
        row.appendChild(cell);
  
        if (header.sortable){
            let sortLEment = header.order ? 
                createElement('span', 'grid-sort ' + header.order, order[header.order]) : 
                createElement('span', 'grid-sort', '♦');
            cell.appendChild(sortLEment);
  
            sortLEment.onclick = function(){
                let order = this.classList.contains('asc') ? 'desc' : 'asc';

                headers.forEach(h => h.order = undefined);
   
                header.order = order;
  
                const sortableData = data.sort( (el, nextEl) => {
                    let element, nextElement;
  
                    if (order === "asc"){
                        element = el[header.key];
                        nextElement = nextEl[header.key];
                    }else{
                        nextElement = el[header.key];
                        element = nextEl[header.key];
                    }
  
                    if (typeof element == "string")
                        return element.localeCompare(nextElement, 'hu',  { sensitivity: "base" });
  
                        return 1;
                    if (element === nextElement)
                        return 0;
  
                    return -1;
                });
  
                renderGrid(sortableData, headers, renderTo);
            }
        }
    }

 for (const element of data) {
    let row = createElement('div', "grid-row");
    grid.appendChild(row);

    for (const header of headers) {
        let cell = createElement(
            'div',
            `grid-cell ${header.className} `,
            header.render ? header.render(element) : element[header.key]
        );
        cell.style.width = header.width ? header.width : '100%';
        row.appendChild(cell);
    }

    row.ondblclick = function () {
        let addOrRemoveRow = this.classList.contains("selected-row") ? "remove" : "add";
        grid.querySelectorAll(".selected-row").forEach(r => r.classList.remove("selected-row"));
        this.classList[addOrRemoveRow]("selected-row");

         row.querySelectorAll('.grid-cell').forEach(cell => {
            cell.contentEditable = false;
        });
    };
}

    document.querySelector(renderTo).appendChild(grid);
  }
  

function request(method, url, callbackFunction, body){
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){  
        if (this.readyState == 4 && this.status == 200) 
            callbackFunction(this.responseText); 
    }
    xhr.open(method, url);
    xhr.send(); 
}


function getRequest(url){
    return new Promise(function(resolve, reject){
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function(){  
            if (this.readyState == 4 && this.status == 200) 
                resolve(this.responseText); 
        }
        
        xhr.open('GET', url);
        xhr.send(); 
    });
}

let ORDERS = [];

getRequest('./orders.json')
.then(response => {
    const parsedOrders = JSON.parse(response);
    ORDERS = parsedOrders;
    return parsedOrders;
})
.then(parsedOrders=>renderGrid(
    //ORDERS
    parsedOrders, 
    [
        {key: 'id', text: 'ID', className: "id", sortable: true},
        {key: 'breadType', text: 'Kenyér típus', className: "breadType",sortable: true},
        {key: 'base', text: 'Alap', className: "baseType" ,sortable: true},
        {key: 'toppings', text: 'Feltétek', className: "toppings", sortable: true},
        {key: 'customerName', text: 'Név', className: "name", sortable: true},
        {key: 'totalPrice', text: 'Fizetendő összeg', className: "price" ,sortable: true},
        {key: `delete`, text: 'Törlés', className: 'delete', 
        render: function(){
            return `<button class="delete">Törlés</button>`},
        },
    ], 
    '#grid-container',
    //console.log(ORDERS)
))
.catch(error => {
        console.error('Error:', error);
}) ;


//console.log(ORDERS)

document.addEventListener("DOMContentLoaded", function () {
    let gridContainer = document.querySelector("#grid-container");
    gridContainer.addEventListener("click", function (event) {
        let target = event.target;
//DELETE
        if (target.classList.contains("delete")) {
            let gridRow = target.closest('.grid-row');
            let orderId = gridRow.querySelector('.id').innerText.trim();

            if (confirm(`Biztos, hogy ki szeretné törölni a ${orderId} számú rendelést?`)) {
                fetch(`/submitOrder/${orderId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    location.reload();
                });
            }
        }
//EDIT - sikerül

})});

let editBtn = document.querySelector("#edit");
    editBtn.onclick = function(){
    let selectedRow = document.querySelector(".selected-row");
        selectedRow.querySelectorAll('.grid-cell').forEach(cell => {
            cell.contentEditable = true;
        })
    }

let saveBtn = document.querySelector("#save")

saveBtn.onclick = function(){

    let gridRow = document.querySelector('.selected-row');
    
    let orderId = gridRow.querySelector('.id').innerText.trim();
    const breadInput = gridRow.querySelector('.breadType').innerText;
    const baseInput = gridRow.querySelector('.baseType').innerText;
    const toppingInput = gridRow.querySelector('.toppings').innerText;
    const priceInput = gridRow.querySelector('.price').innerText;
    const nameInput = gridRow.querySelector('.name').innerText;

    const updatedData = {
        id: orderId,
        name: nameInput,
        totalPrice: priceInput,
        baseType: baseInput,
        breadType: breadInput,
        toppings: toppingInput,
    };


            fetch(`http://localhost:2000/submitOrder`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                location.reload();
            });
        };