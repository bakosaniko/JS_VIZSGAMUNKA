
console.log("Sandwich Wizard");

let currentPage = 'start';
let breadType = '';
let baseType = '';
let toppings = [];
let customerName = '';

let totalPrice = 0;
let actualPriceElement = document.querySelector("#actual-price");

let form = document.querySelector("order-form")


function goToPage(page) {
    currentPage = page;

    if (page === 'breadtype') {

        document.querySelector('#breadType-options', "#priceSum").style.display = 'block';
        document.querySelector('#start').style.display = 'none';
        document.querySelector( "#baseType-options").style.display = 'none';
    } else if (page === 'baseType') {
        let checkedBread = document.querySelector("input[type='radio'][name=bread]:checked");    
        if(checkedBread != null){
            breadType = checkedBread.value;
            document.querySelector("#breadTypeSummary").innerHTML = breadType;}
        document.querySelector('#baseType-options').style.display = 'block';
        document.querySelector('#breadType-options').style.display = 'none';
        document.querySelector('#toppings-options').style.display = 'none';

    } else if (page === 'toppings') {
        let checkedBase = document.querySelector("input[type='radio'][name=baseType]:checked");
        if(checkedBase != null){
            baseType = checkedBase.value;
            document.querySelector("#baseTypeSummary").innerHTML = baseType;
        } else {
            document.querySelector('#baseTypeSummary').innerHTML = "Nincs kiválasztott alap";
        };
        document.querySelector('#toppingsSummary').innerText = toppings.join(', ');
        document.querySelector('#toppings-options').style.display = 'block';
        document.querySelector('#baseType-options').style.display = 'none';
        document.querySelector('#customerName-section').style.display = 'none';

    } else if (page === 'customerName') {
        
        const checkboxes = document.querySelectorAll('input[name="toppings"]:checked');
        checkboxes.forEach(checkbox => toppings.push(checkbox.value));
        document.querySelector('#toppingsSummary').innerHTML = toppings.join(', ');
        document.querySelector('#customerName-section').style.display = 'block';
        document.querySelector('#toppings-options').style.display = 'none';
        document.querySelector('#summary').style.display = 'none';
        document.querySelector("#finalPrice").innerHTML = totalPrice;
    } else if (page === 'summary') {
        customerName = document.querySelector(`input[name='customerName']`).value;
        document.querySelector('#customerNameSummary').innerHTML = customerName;
        document.querySelector('#summary').style.display = 'block';
        document.querySelector('#customerName-section').style.display = 'none';
    } else if (page === 'start') {
        document.querySelector('#start').style.display = 'block';
        document.querySelector('#summary').style.display = 'none';
        document.querySelector("#breadType-options").style.display = 'none';

    }
}


//VAlIDATE

function validateDiv(currentDiv) {
    switch (currentDiv) {
        case 'bread-options':
            let checkedBreadInputs = document.querySelector(`input[type='radio'][name=bread]:checked`);
            
           if(checkedBreadInputs != null) {
            return true;
           }
            else if(checkedBreadInputs == null){
                return false;
            } 

        case 'toppings':
            return document.querySelectorAll('input[name="toppings"]:checked').length > 0;
        case 'customerName-section':
            return document.querySelector('#customerName-section input').value.trim() !== '';
        default:
            alert('Kérem válasszon a megadott lehetőségek közül!');
        
    }
}

//-----------TOVÁBB GOMBOK------------
    document.querySelector("#strt-btn").addEventListener("click", function () {
        goToPage('breadtype');
    });

    document.querySelector("#next1").addEventListener("click", function () {
        if (validateDiv('bread-options')) {
            goToPage('baseType');
        }else {
            goToPage('breadType');
            alert("Kérem válasszon egy kenyér típust!");
        }
   });
    
    document.querySelector("#next2").addEventListener("click", function () {
            goToPage('toppings');
    });
    
    document.querySelector("#next3").addEventListener("click", function () {
        if (validateDiv('toppings')) {
            goToPage('customerName');
        } else {
            alert("Kérem válasszon legalább egy feltétet!");
        }
    });
    
    document.querySelector("#next4").addEventListener("click", function () {
        if (validateDiv('customerName-section')) {
            goToPage('summary');
        } else {
            alert("Kérem adja meg a nevét!");
        }
    });

    document.querySelector("#submit").addEventListener("click", function (){
        alert("Köszönjük a rendelést!");
        submitOrder();
        resetfields(form);
        resetPrice(this);
        goToPage('start');
       

    });

//-----------VISSZA GOMBOK------------
    document.querySelector("#back1").addEventListener("click", function () {
        goToPage('start');
        });
    document.querySelector("#back2").addEventListener("click", function () {
        goToPage('breadtype');
        });
    document.querySelector("#back3").addEventListener("click", function () {
        goToPage('baseType');
        });
    document.querySelector("#back4").addEventListener("click", function () {
        goToPage('toppings');

        });
    document.querySelector("#back5").addEventListener("click", function () {
        goToPage('customerName');
        });

//--------------ÁRAK-----------------
let selectedBread= null;
    let selectedBaseType = null; 
    let toppingsPrice = null;
    let previousToppings = [];

document.addEventListener("DOMContentLoaded", function () {
    let prices = {
                "bread": {
                  "Fehér kenyér": 400,
                  "Teljes kiőrlésű kenyér": 550,
                  "Ciabatta": 600,
                  "Szénhidrát-csökkentett cipó": 750
                },
                "baseType": {
                  "Vaj": 300,
                  "Majonéz": 400,
                  "Marinara szósz": 500
                },
                "toppings": {
                  "sajt": 200,
                  "sonka": 300,
                  "szalámi": 300,
                  "uborka": 100,
                  "paradicsom": 100
                }

    };
  
    let breadOptions = document.getElementsByName("bread");
    let baseTypeOptions = document.getElementsByName("baseType");
    let toppingsOptions = document.getElementsByName("toppings");
   
    
    

    function updateActualPrice() {

        // Bread price ---- MŰKÖDIK
        for (let i = 0; i < breadOptions.length; i++) {
          if (breadOptions[i].checked && selectedBread == null) {
          selectedBread = breadOptions[i].value;
          totalPrice += prices.bread[breadOptions[i].value];
          } else if(breadOptions[i].checked && selectedBread != null){
            totalPrice -= prices.bread[selectedBread];
            selectedBread = breadOptions[i].value;
            totalPrice += prices.bread[breadOptions[i].value];
          }
        }
    
        // BaseType price --- MŰKÖDIK
        for (let i = 0; i < baseTypeOptions.length; i++) {
          if (baseTypeOptions[i].checked && selectedBaseType == null) {
          selectedBaseType = baseTypeOptions[i].value;
          totalPrice += prices.baseType[baseTypeOptions[i].value];
          } else if(baseTypeOptions[i].checked && selectedBaseType != null){
            totalPrice -= prices.baseType[selectedBaseType];
            selectedBaseType = baseTypeOptions[i].value;
            totalPrice += prices.baseType[baseTypeOptions[i].value];
          } 
        }

        // Toppings price
  
        for (let i = 0; i < toppingsOptions.length; i++) {
          let currentTopping = toppingsOptions[i];
                if (currentTopping.checked && previousToppings.includes(currentTopping.value)==false) {
                    toppingsPrice += prices.toppings[currentTopping.value];
                    totalPrice += prices.toppings[currentTopping.value];
                    previousToppings.push(currentTopping.value);
                    console.log(previousToppings);
                  } if(!currentTopping.checked && previousToppings.includes(currentTopping.value) == true){
                   totalPrice -= prices.toppings[currentTopping.value];
                   let deletedTopping = currentTopping.value
                   let deletedindex = previousToppings.indexOf(deletedTopping)
                   if (deletedindex !== -1){
                    previousToppings.splice(deletedindex,1)
                   }
                  } 
        };
        
     actualPriceElement.textContent = "A jelenlegi ár: " + totalPrice.toFixed(2) + " Ft";
      };

      for (let i = 0; i < breadOptions.length; i++) {
        breadOptions[i].addEventListener("change", updateActualPrice);
      }
    
      for (let i = 0; i < baseTypeOptions.length; i++) {
        baseTypeOptions[i].addEventListener("change", updateActualPrice);
      }
    
      for (let i = 0; i < toppingsOptions.length; i++) {
        toppingsOptions[i].addEventListener("change", updateActualPrice);
      }
    
    });

function resetPrice(){
totalPrice = 0
  selectedBread= null;
  selectedBaseType = null; 
  toppingsPrice = null;
  previousToppings = [];
  actualPriceElement.textContent = "A jelenlegi ár: " + totalPrice + " Ft";

 };

//----------RESET
function resetfields() {

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.querySelectorAll('input[type="text"]').forEach(text => {
        text.value = null;

});

};



//-----------JSON EXPORT----------------

function submitOrder() {
        let orderData = {
            breadType: breadType,
            baseType: baseType,
            toppings: toppings,
            customerName: customerName,
            totalPrice: totalPrice
    };

    fetch('http://localhost:2000/submitOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify(orderData) 
    })
    .then(response => response.text())
    .then(message => {
        console.log(message);
       
    })
    .catch(error => console.error('Error submitting order:', error));
}
