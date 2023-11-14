const main = document.getElementById('main');
const addUserBtn = document.getElementById('add-user');
const doubleBtn = document.getElementById('double');
const showMillionairesBtn = document.getElementById('show-millionaires');
const sortBtn = document.getElementById('sort');
const calculateWealthBtn = document.getElementById('calculate-wealth');
const cleanElement = document.getElementById("clean");

let userList = [];

const storedUserList = JSON.parse(localStorage.getItem('userList')) || [];

if (storedUserList.length > 0) {
  userList = storedUserList;
  updateDOM();
}

// Mostrar totalWealth si existe en localStorage al cargar la página
const storedTotalWealth = localStorage.getItem('totalWealth');
if (storedTotalWealth) {
  displayTotalWealth(storedTotalWealth);
}

addUserBtn.addEventListener('click', getRandomUser);
doubleBtn.addEventListener('click', doubleMoney);
sortBtn.addEventListener('click', sortByRichest);
showMillionairesBtn.addEventListener('click', showMillionaires);
calculateWealthBtn.addEventListener('click', calculateWealth);
cleanElement.addEventListener('click', clean);

function clean() {
  userList = [];
  updateDOM();
  localStorage.removeItem('userList');
  localStorage.removeItem('totalWealth');
  // Eliminar el elemento de la riqueza al limpiar
  const existingWealthElement = document.querySelector('.wealth');
  if (existingWealthElement) {
    existingWealthElement.remove();
  }
}

async function getRandomUser() {
  let res = await fetch('https://randomuser.me/api');
  let data = await res.json();
  let user = data.results[0];
  let newUser = {
    name: `${user.name.first} ${user.name.last}`,
    money: Math.random() * 100000
  };
  addData(newUser);
}

function addData(obj) {
  userList.push(obj);
  updateDOM();
  saveToLocalStorage();
}

function doubleMoney() {
  userList = userList.map(element => ({
    name: element.name,
    money: element.money * 2
  }));
  updateDOM();
  saveToLocalStorage();
}

function sortByRichest() {
  userList.sort((a, b) => b.money - a.money);
  updateDOM();
  saveToLocalStorage();
}

function showMillionaires() {
  userList = userList.filter(element => element.money > 1000000);
  updateDOM();
  saveToLocalStorage();
}

function calculateWealth() {
  const existingWealthElement = document.querySelector('.wealth');

  if (existingWealthElement) {
    return;
  }

  let wealth = userList.reduce((acc, user) => (acc += user.money), 0);
  let wealthElement = document.createElement('div');
  wealthElement.classList.add('wealth');
  let wealthFormated = formatMoney(wealth);
  wealthElement.innerHTML = `<h3>Dinero total: <strong>${wealthFormated}</strong></h3>`;
  main.appendChild(wealthElement);
  localStorage.setItem('totalWealth', wealthFormated);
}

// Función para mostrar totalWealth en el DOM
function displayTotalWealth(wealth) {
  let wealthElement = document.createElement('div');
  wealthElement.classList.add('wealth');
  wealthElement.innerHTML = `<h3>Dinero total: <strong>${wealth}</strong></h3>`;
  main.appendChild(wealthElement);
}

function updateDOM() {
  main.innerHTML = '<h2><strong>Persona</strong> Dinero</h2>';

  userList.forEach(user => {
    let userElement = document.createElement("div");
    userElement.classList.toggle("person");
    let moneyFormated = formatMoney(user.money);
    userElement.innerHTML = `<strong>${user.name} </strong> ${moneyFormated}`;
    main.appendChild(userElement);
  });
}

function saveToLocalStorage() {
  localStorage.setItem('userList', JSON.stringify(userList));
}

function formatMoney(number) {
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '€';
}
