const drinks = data.drinks;
const drinkSizes = data.drinkSizes;
const extras = data.extras;
const defaultValues = data.defaults;
const milkTypes = data.milkTypes;

window.onload = () => {
    init();
}

init = () => {
    initElement("drink", drinks);
    initElement("drink-size", drinkSizes);
    initElement("cream", extras);
    initElement("milk-type", milkTypes);
    calculatePrice();
    checkMilk();
    checkSyrup();
    storageInit();
}

initElement = (elementId, elementData) => {
    const element = document.getElementById(elementId);
    let innerHtml = "";

    for(let key in elementData) {
        if(defaultValues[elementId] && defaultValues[elementId] == key) {
            innerHtml += "<option selected value='" + key + "'>" + elementData[key].name + "</option>";
        } else {
            innerHtml += "<option value='" + key + "'>" + elementData[key].name + "</option>";
        }
    }

    element.innerHTML = innerHtml;
}

checkMilk = () => {
    let selectedDrink = document.getElementById("drink").value;

    if(drinks[selectedDrink].milk == true) {
        document.getElementById("milk-type").disabled = false;
    } else {
        document.getElementById("milk-type").disabled = true;
    }
}

checkSyrup = () => {
    let selectedExtra = document.getElementById("cream").value;

    if(extras[selectedExtra].name == "syrup") {
        document.getElementById("syrup").disabled = false;
    } else {
        document.getElementById("syrup").disabled = true;
        document.getElementById("syrup").innerHTML = "";
    }
}

document.getElementById("drink").onchange = () => {
    checkMilk();
}

document.getElementById("cream").onchange = () => {
    checkSyrup();
    calculatePrice();
}

document.getElementById("drink-size").onchange = () => {
    calculatePrice();
}

document.getElementById("syrup").onkeyup = () => {
    calculatePrice();
}

document.getElementById("add-to-order").onclick = () => {
    let order = JSON.parse(window.localStorage.getItem("order"));
    let item = {};
    let length = Object.keys(order).length;
    let purchasedDrinks = parseInt(window.localStorage.getItem("purchasedDrinks"));
    let overallPrice = parseFloat(window.localStorage.getItem("overallPrice"));
    let subTotal = parseFloat(window.localStorage.getItem("subTotal"));
    item.drink = document.getElementById("drink").value;
    item.drinkSize = document.getElementById("drink-size").value;
    item.milkType = document.getElementById("milk-type").value;
    item.cream = document.getElementById("cream").value;
    item.syrupCount = document.getElementById("syrup").value;
    if(purchasedDrinks % 10 == 0 && purchasedDrinks > 0) {
        item.price = " 0";
    } else {
        item.price = document.getElementById("current-drink").innerHTML;
    }
    
    order[length] = item;
    purchasedDrinks++;
    overallPrice += parseFloat(item.price.substring(1));
    overallPrice = Math.round(overallPrice * 100) / 100;
    subTotal += parseFloat(item.price.substring(1));
    subTotal = Math.round(subTotal * 100) / 100;
    window.localStorage.setItem("order", JSON.stringify(order));
    window.localStorage.setItem("purchasedDrinks", purchasedDrinks);
    window.localStorage.setItem("overallPrice", overallPrice);
    window.localStorage.setItem("subTotal", subTotal);
    updateOverallOrder();
}

document.getElementById("add-to-favourite").onclick = () => {
    let item = {};
    item.drink = document.getElementById("drink").value;
    item.drinkSize = document.getElementById("drink-size").value;
    item.milkType = document.getElementById("milk-type").value;
    item.cream = document.getElementById("cream").value;
    item.syrupCount = document.getElementById("syrup").value;
    item.price = document.getElementById("current-drink").innerHTML;

    window.localStorage.setItem("favourite", JSON.stringify(item));
}

document.getElementById("order-favourite").onclick = () => {
    let order = JSON.parse(window.localStorage.getItem("order"));
    const favourite = JSON.parse(window.localStorage.getItem("favourite"));
    let overallPrice = parseFloat(window.localStorage.getItem("overallPrice"));
    let subTotal = parseFloat(window.localStorage.getItem("subTotal"));
    const length = Object.keys(order).length;
    let purchasedDrinks = parseInt(window.localStorage.getItem("purchasedDrinks"));

    if(Object.keys(favourite).length == 0) {
        alert("No favourite drink");
        return;
    }

    order[length] = favourite;
    purchasedDrinks++;
    overallPrice += parseFloat(favourite.price.substring(1));
    overallPrice = Math.round(overallPrice * 100) / 100
    subTotal += parseFloat(favourite.price.substring(1));
    subTotal = Math.round(subTotal * 100) / 100
    window.localStorage.setItem("order", JSON.stringify(order));
    window.localStorage.setItem("purchasedDrinks", purchasedDrinks);
    window.localStorage.setItem("overallPrice", overallPrice);
    window.localStorage.setItem("subTotal", subTotal);
    updateOverallOrder();
}

document.getElementById("place-order").onclick = () => {
    alert("Thank you!!!");
    document.getElementById("overall-orders").innerHTML = "";
    document.getElementById("subtotal").innerHTML = 0;
    window.localStorage.setItem("order", "{}");
    window.localStorage.setItem("subTotal", 0);
}

updateOverallOrder = () => {
    const orderElement = document.getElementById("overall-orders");
    const priceElement = document.getElementById("overall-price");
    const subTotalElement = document.getElementById("subtotal");
    let order = JSON.parse(window.localStorage.getItem("order"));
    let overallPrice = window.localStorage.getItem("overallPrice");
    let subTotal = window.localStorage.getItem("subTotal");
    let innerHtml = "";

    for(let key in order) {
        innerHtml += "<div class='order-item'>";
        innerHtml += "<p>Choice of Drink: " + drinks[order[key].drink].name;
        innerHtml += "<p>Size of Drink: " + drinkSizes[order[key].drinkSize].name;

        if(drinks[order[key].drink].milk == true) {
            innerHtml += "<p>Type of Milk: " + milkTypes[order[key].milkType].name;
        }

        innerHtml += "<p>Extra Cream: " + extras[order[key].cream].name;

        if(order[key].syrupCount != "") {
            innerHtml += "<p>Count: " + order[key].syrupCount;
        }

        innerHtml += "<p>Price: " + order[key].price;
        innerHtml += "<hr />";
        innerHtml += "</div>";
    }

    orderElement.innerHTML = innerHtml;
    priceElement.innerHTML = overallPrice;
    subTotalElement.innerHTML = subTotal;

}

calculatePrice = () => {
    const selectedDrinkSize = document.getElementById("drink-size").value;
    const selectedExtra = document.getElementById("cream").value;
    let price = drinkSizes[selectedDrinkSize].price;

    if(extras[selectedExtra].name == "syrup") {
        const syrupCount = parseInt(document.getElementById("syrup").value) || 0;
        price += extras[selectedExtra].price * syrupCount;
    } else {
        price += extras[selectedExtra].price;
    }

    document.getElementById("current-drink").innerHTML = "£" + price;
}

storageInit = () => {
    window.localStorage.clear();
    window.localStorage.setItem("favourite", "{}");
    window.localStorage.setItem("purchasedDrinks", 0);
    window.localStorage.setItem("order", "{}");
    window.localStorage.setItem("overallPrice", 0);
    window.localStorage.setItem("subTotal", 0);
}