// OpenWeatherMap API key
const api_key = "&appId=11c808d987e218ec7aa6da6b91d0221e";

// Base URL for OpenWeatherMap API calls
const baseURL = `https://api.openweathermap.org/data/2.5/weather?units=metric&zip=`;
const baseURLIcon = (iconId) =>
  `http://openweathermap.org/img/wn/${iconId}@2x.png`;

// Global Varibales
const generateButton = document.querySelector("#generate");
const zipCode = document.querySelector("#zip");
const feelings = document.querySelector("#feelings");
const entryHolderIcon = document.querySelector("#icon");
const entryHolderDate = document.querySelector("#date");
const entryHolderTemp = document.querySelector("#temp");
const entryHolderContent = document.querySelector("#content");

// Functions
const loading = (status = false) => {
  document.querySelector(".loading").style.display = status ? "flex" : "none";
};

// On click submit
generateButton.addEventListener("click", function generateNewEntry(e) {
  e.preventDefault();

  loading(true);
  // Get current date
  let date = new Date();

  // Convert it to string 'yyyy-mm-dd'
  dateAsString = `${date.getUTCFullYear()}-${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

  // if Zipcode is provided
  if (zipCode.value) {
    // O.W.M API Calling with zipCode
    getTheWetherByZipcode(zipCode.value)
      .then((response) => {
        // Create object from response include date

        const data = {
          date: dateAsString,
          temperature: response.main.temp,
          userResponse: feelings.value,
          apiResponse: response,
        };

        // Send to server
        sendToServer("/store", data);

        getFromServer("/all").then((res) => {
          console.log(res);
          entryHolderDate.innerHTML = res.date;
          entryHolderTemp.innerHTML = `${res.temperature} <sup>o</sup>C`;
          entryHolderContent.innerHTML = res.userResponse;
          entryHolderIcon.src = baseURLIcon(res.apiResponse.weather[0].icon);
          document.querySelector(".holder.entry").style.display = "block";
        });
      })
      .finally(() => {
        loading(false);
      });
  }

  // Alert if not provideed
  else alert("Zipcode is required");
});

const getTheWetherByZipcode = async (zipcode) => {
  // Store the response from the O.W.M API
  const response = await fetch(baseURL + zipcode + api_key);

  // Successfully retured data
  try {
    // Convert to JSON
    const weatherResponse = await response.json();

    // return JSON response
    return weatherResponse;
  } catch (error) {
    console.log({ error });
  }
};

const sendToServer = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log({ error });
  }
};

const getFromServer = async (url = "") => {
  const response = await fetch(url);

  try {
    const data = await response.json();

    return data;
  } catch (error) {
    console.log({ error });
  }
};
