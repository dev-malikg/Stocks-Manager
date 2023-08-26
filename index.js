// FUNCTIONS
function deleteAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

const setCookie = (name, json) => {
  let cookieValue = '';
  let expire = '';
  let period = '';

  cookieValue = name + '=' + JSON.stringify(json) + ';';
  // cookieValue += 'path=/ ;';

  //Specify how long you want to keep cookie
  period = 30; //days to store
  expire = new Date();
  expire.setTime(expire.getTime() + 1000 * 3600 * 24 * period);
  expire.toUTCString();
  cookieValue += 'expires=' + expire + ';';

  document.cookie = cookieValue;
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function addLi(id, stock_name, bands) {
  let innerhtml = "";
  let className = "";

  if (bands == "Buy") { innerhtml = `<input id='${id}' class='checkboxx' type='checkbox'> ${stock_name} <span id='${id}' class='buyLable'>Buy</span>`; className = "liii-b"; }
  else if (bands == "Sell") { innerhtml = `<input id='${id}' class="checkboxx" type="checkbox"> ${stock_name} <span id='${id}' class="sellLable">Sell</span>`; className = "liii-s"; }

  var ul = document.getElementById("stocksList");
  var li = document.createElement("li");
  li.innerHTML = innerhtml;
  li.setAttribute("class", className);
  li.setAttribute("id", id);
  ul.appendChild(li);
}
function addP(date) {
  var ul = document.getElementById("stocksList");
  var li = document.createElement("p");

  li.innerHTML = `${date}`;
  li.setAttribute("class", "datePera");
  ul.appendChild(li);
}

// Create a new Date object
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth();
let day = currentDate.getDate();
let todaysDate = `${year}-${month + 1}-${day}`;
// todaysDate = `2023-8-27`;
// day = 27



// MAIN JS 

// refrences of html attributes
document.getElementById("addBtn").addEventListener("click", handelAddBtn);
document.getElementById("menuBtn").addEventListener("click", handelMenuBtn);
const inputdata = document.getElementById("formInput");
const bsdata = document.getElementById("formSelector");

// Setting current_id
let current_id = 0;

// Acessing old cookies data from databasepool and rendering them
let cookiesUnpack = {};
let cookiData_array = [];
let keys = 0;

try {
  // getting all cookies 
  cookiesUnpack = JSON.parse(getCookie("db"));
  console.log(document.cookie)

  cookiData_array = cookiesUnpack[todaysDate];
  if (!cookiData_array) { cookiData_array = [] }

  keys = Object.keys(cookiesUnpack);
  for (let i = (keys.length - 1); i >= 0; i--) {
    const key = keys[i];
    const value = cookiesUnpack[key];

    const keyDate = key.slice(-2);
    let tempDate = parseInt(keyDate)

    let allowRenderDate = false;
    value.forEach(function (element) { if (element.render) { allowRenderDate = true } });

    if (allowRenderDate) {
      if (tempDate == parseInt(day)) {
        addP("Today");
      }
      else if (tempDate == (parseInt(day) - 1)) {
        addP("yesterday");
      }
      else {
        addP(key);
      }
    }

    value.forEach(function (entry) {
      if (entry.render) { addLi("00" + entry.stock_id, entry.stock_name, entry.stock_bs) }
      current_id++;
    });
  }
}
catch (e) {
  cookiesUnpack = {};
  cookiData_array = [];
}



// code runs on add btn clicked 
function handelAddBtn() {
  let data = {
    stock_name: inputdata.value,
    stock_bs: bsdata.value,
    stock_id: current_id,
    render: true,
  }

  cookiData_array.push(data)
  cookiesUnpack[todaysDate] = cookiData_array;
  setCookie('db', cookiesUnpack);

  current_id++;
  console.log("cookies are set :)");
}


// code runs on menu btn clicked 
function handelMenuBtn() {
  const result = confirm("Do you want to clear your Stocks list?");
  if (result) {
    deleteAllCookies();
    cookiesUnpack = {};
    window.location.reload();
  }
}


// setting a condition for checkbox to be checked 
for (let i = 0; i < current_id; i++) {
  try {
    let checkbox = document.getElementById('00' + i);
    checkbox.addEventListener('change', (event) => {

      var checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked');
      let selectedCbId = parseInt(checkedBoxes[0].id);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = cookiesUnpack[key];

        value.forEach(function (element) {
          if (element.stock_id == selectedCbId) {
            element.render = false;
            setCookie('db', cookiesUnpack);
            window.location.reload();
          }
        });
      }

    });
  }
  catch (e) { }
}

// var checkedBoxes = document.querySelectorAll('input[type=checkbox]');
// console.log(checkedBoxes);


