"use strict";

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

/**
 * @param {NodeList} elements
 * @param {string} eventType
 * @param {Function} callback
 **/

const addEventOnElements = function (elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
};

const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searchTogglers, "click", toggleSearch);

const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input", function () {
  searchTimeout ?? clearTimeout(searchTimeout);
  if (searchField.value) {
    searchResult.classList.remove("active");
    searchResult.innerHTML = "";
    searchField.classList.remove("searching");
  } else {
    searchField.classList.add("searching");
  }
  if (searchField.value) {
    searchTimeout = setTimeout(() => {
      fetchData(url.geo(searchField.value), function (locations) {
        searchField.classList.remove("searching");
        searchResult.classList.add("active");
        searchResult.innerHTML = `
        <ul class="view-list" data-search-list></ul>
    `;

        const items = [];
        for (const { local_names, lat, lon, country, state } of locations) {
          const searchItem = document.createElement("li");
          searchItem.classList.add("view-item");

          searchItem.innerHTML = `
          <span class="m-icon">location_on</span>
          <div>
            <p class="item-title">${local_names.ja}</p>
            <p class="label-2 item-subtitle">${state || ""} ${country}</p>
          </div>
          <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${
            local_names.ja
          } weather" data-search-toggler></a>
      `;

          searchResult
            .querySelector("[data-search-list]")
            .appendChild(searchItem);
          items.push(searchItem.querySelector("[data-search-toggler]"));
        }
        addEventOnElements(items, "click", function () {
          toggleSearch();
          searchResult.classList.remove("active");
        });
      });
    }, searchTimeoutDuration);
  }
});

const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector(
  "[data-current-location-btn]"
);
const errorContent = document.querySelector("[data-error-content]");
/**
 * @param {number} lat
 * @param {number} lon
 **/
export const updataWeather = function (lat, lon) {
  loading.style.display = "grid";
  container.style.overflowY = "hidden";
  container.classList.remove("fade-in");
  errorContent.style.display = "none";

  const currentWeatherSection = document.querySelector(
    "[data-current-weather]"
  );
  const highlightSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const forecastSection = document.querySelector("[data-5-day-forecast]");

  currentWeatherSection.innerHTML = "";
  highlightSection.innerHTML = "";
  hourlySection.innerHTML = "";
  forecastSection.innerHTML = "";

  if (window.location.hash === "#/current-location") {
    currentLocationBtn.setAttribute("disabled", "");
  } else {
    currentLocationBtn.removeAttribute("disabled");
  }
  const descriptionDict = {
    "clear sky": "快晴",
    "few clouds": "晴れ（やや曇り）",
    "scattered clouds": "晴れ（時々曇り）",
    "broken clouds": "曇り（やや晴れ）",
    "overcast clouds": "曇り",
    mist: "靄",
    smoke: "煙霧",
    haze: "もや",
    dust: "砂ほこり",
    fog: "霧",
    sand: "砂塵",
    "dust and sand": "砂ほこりと砂塵",
    "shower rain": "にわか雨",
    "light rain": "小雨",
    "moderate rain": "雨",
    "heavy intensity rain": "大雨",
    "very heavy rain": "激しい雨",
    "extreme rain": "猛烈な雨",
    "freezing rain": "着氷性の雨",
    "light intensity shower rain": "軽いにわか雨",
    "heavy intensity shower rain": "強いにわか雨",
    "ragged shower rain": "断続的なにわか雨",
    "thunderstorm with light rain": "雷を伴う小雨",
    "thunderstorm with rain": "雷を伴う雨",
    "thunderstorm with heavy rain": "雷を伴う大雨",
    "light thunderstorm": "小さな雷雨",
    "moderate thunderstorm": "雷雨",
    "heavy thunderstorm": "激しい雷雨",
    "ragged thunderstorm": "断続的な雷雨",
    "thunderstorm with light drizzle": "雷を伴う霧雨",
    "thunderstorm with drizzle": "雷を伴う霧雨",
    "thunderstorm with heavy drizzle": "雷を伴う強い霧雨",
    "light snow": "小雪",
    snow: "雪",
    "heavy snow": "大雪",
    sleet: "みぞれ",
    "shower sleet": "にわかみぞれ",
    "light rain and snow": "小雨と雪",
    "rain and snow": "雨と雪",
    "light shower snow": "小雪のにわか降り",
    "shower snow": "にわか降りの雪",
    "heavy shower snow": "激しいにわか降りの雪",
    tornado: "竜巻",
    "tropical storm": "熱帯低気圧",
    hurricane: "ハリケーン",
    cold: "冷",
    hot: "暑",
    windy: "風",
    hail: "雹",
  };

  fetchData(url.currentWeather(lat, lon), function (currentWeather) {
    const {
      weather,
      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone,
    } = currentWeather;
    const [{ description, icon }] = weather;
    const descriptionJP = descriptionDict[description] || description;

    const card = document.createElement("div");
    card.classList.add("card", "card-lg", "current-weather-card");

    card.innerHTML = `
      <h2 class="title-2 card-title">現在</h2>
      <div class="weapper">
        <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>
        <img
          src="./assets/images/weather_icons/${icon}.png"
          width="64"
          height="64"
          alt="${description}"
          class="weather-icon"
        />
      </div>
      <p class="body-3">${descriptionJP}</p>
      <ul class="meta-list">
        <li class="meta-item">
          <span class="m-icon">calendar_today</span>
          <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
        </li>
        <li class="meta-item">
          <span class="m-icon">location_on</span>
          <p class="title-3 meta-text" data-location></p>
        </li>
      </ul>
    `;
    fetchData(url.reverseGeo(lat, lon), function ([{ local_names, country }]) {
      card.querySelector(
        "[data-location]"
      ).innerHTML = `${local_names.ja},${country}`;
    });
    currentWeatherSection.appendChild(card);

    fetchData(url.airPollution(lat, lon), function (airPollution) {
      const [
        {
          main: { aqi },
          components: { no2, o3, so2, pm2_5 },
        },
      ] = airPollution.list;
      const card = document.createElement("div");
      card.classList.add("card", "card-lg");
      card.innerHTML = `             
      <h2 class="title-2" id="highlights-label">今日の天気</h2>
      <div class="highlight-list">
      <div class="card card-sm highlight-card one" >
        <h3 class="title-3">空気質指数</h3>
        <div class="wrapper">
          <span class="m-icon">air</span>
          <ul class="card-list">
            <li class="card-item">
              <p class="title-1">${pm2_5.toPrecision(3)}</p>
              <p class="label-1">PM<sub>2.5</sub></p>
            </li>
            <li class="card-item">
              <p class="title-1">${so2.toPrecision(3)}</p>
              <p class="label-1">SO<sub>2.5</sub></p>
            </li>
            <li class="card-item">
              <p class="title-1">${no2.toPrecision(3)}</p>
              <p class="label-1">NO<sub>2</sub></p>
            </li>
            <li class="card-item">
              <p class="title-1">${o3.toPrecision(3)}</p>
              <p class="label-1">O<sub>3</sub></p>
            </li>
          </ul>
        </div>

        <span class="badge aqi-${aqi} label-${aqi}" title="${
        module.aqiText[aqi].message
      }"
          >${module.aqiText[aqi].level}</span
        >
      </div>
      <div class="card card-sm highlight-card two">
        <h3 class="title-3">日の出・日の入</h3>
        <div class="card-list">
          <div class="card-item">
            <span class="m-icon">clear_day</span>

            <p class="label-1">日の出</p>
            <p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>
          </div>
          <div class="card-item">
            <span class="m-icon">clear_night</span>

            <p class="label-1">日の入</p>
            <p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>
          </div>
        </div>
      </div>

      <div class="card card-sm highlight-card">
        <h3 class="title-3">湿度</h3>
        <div class="wrapper">
          <span class="m-icon">humidity_percentage</span>

          <p class="title-1">${humidity}<sub>%</sub></p>
        </div>
      </div>
      <div class="card card-sm highlight-card">
        <h3 class="title-3">気圧</h3>
        <div class="wrapper">
          <span class="m-icon">airwave</span>

          <p class="title-1">${pressure}<sub>hPa</sub></p>
        </div>
      </div>
      <div class="card card-sm highlight-card">
        <h3 class="title-3">視程</h3>
        <div class="wrapper">
          <span class="m-icon">visibility</span>

          <p class="title-1">${visibility / 1000}<sub>km</sub></p>
        </div>
      </div>
      <div class="card card-sm highlight-card">
        <h3 class="title-3">体感温度</h3>
        <div class="wrapper">
          <span class="m-icon">thermostat</span>

          <p class="title-1">${parseInt(feels_like)}&deg;<sub>c</sub></p>
        </div>
      </div>
    </div>`;

      highlightSection.appendChild(card);
    });

    fetchData(url.forecast(lat, lon), function (forecast) {
      const {
        list: forecastList,
        city: { timezone },
      } = forecast;

      hourlySection.innerHTML = `
      <h2 class="title-2">3時間ごとの天気予報</h2>
      <div class="slider-container">
        <ul class="slider-list" data-temp>
        </ul>

        <ul class="slider-list" data-wind>
    
        </ul>
      </div>
      `;
      for (const [index, data] of forecastList.entries()) {
        if (index > 7) break;
        const {
          dt: dateTimeUnix,
          main: { temp },
          weather,
          wind: { deg: windDirection, speed: windSpeed },
        } = data;
        const [{ icon, description }] = weather;
        const tempLi = document.createElement("li");
        tempLi.classList.add("slider-item");
        tempLi.innerHTML = `
        <div class="card card-sm slider-card">
        <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
        <img
          src="./assets/images/weather_icons/${icon}.png"
          width="48"
          height="48"
          loading="lazy"
          alt="${description}"
          class="weather-icon"
          title="${description}"
        />
        <p class="body-3">${parseInt(temp)}&deg;</p>
      </div>
        `;

        hourlySection.querySelector("[data-temp]").appendChild(tempLi);

        const windLi = document.createElement("li");
        windLi.classList.add("slider-item");

        windLi.innerHTML = ` 
        <div class="card card-sm slider-card">
        <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
        <img
          src="./assets/images/weather_icons/direction.png"
          width="48"
          height="48"
          loading="lazy"
          alt="direction"
          class="weather-icon"
          style="transform: rotate(${windDirection - 180}deg)"
        />
        <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>
      </div>
        `;

        hourlySection.querySelector("[data-wind]").appendChild(windLi);
      }

      forecastSection.innerHTML = `
      <h2 class="title-2" id="forecast-label">5日間天気予報</h2>
      <div class="card card-lg forecast-card">
        <ul data-forecast-list></ul>
      </div>
      `;
      for (let i = 7, len = forecastList.length; i < len; i += 8) {
        const {
          main: { temp_max },
          weather,
          dt_txt,
        } = forecastList[i];

        const [{ icon, description }] = weather;
        const date = new Date(dt_txt);

        const li = document.createElement("li");
        li.classList.add("card-item");
        // const temperature = 7;
        // const formattedTemperature =
        //   temperature.toLocaleString("en-US", {
        //     minimumIntegerDigits: 2,
        //   }) + "&deg;";
        li.innerHTML = `
        <div class="icon-wrapper">
        <img
          src="./assets/images/weather_icons/${icon}.png"
          width="36"
          height="36"
          alt="${descriptionJP}"
          class="weather-icon"
          title="${descriptionJP}"
        />
        <span class="span">
        <p class="title-2">${parseInt(temp_max)}&deg;</p>
        </span>
      </div>

      <p class="label-1 ">${
        module.monthNames[date.getUTCMonth()]
      }${date.getDate()}日</p>
      <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
        `;
        forecastSection.querySelector("[data-forecast-list]").appendChild(li);
      }

      loading.style.display = "none";
      container.style.overflowY = "overlay";
      container.classList.add("fade-in");
    });
  });
};

export const error404 = function () {};
