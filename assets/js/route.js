"use strict";

import { updataWeather, error404 } from "./app.js";

const defaultLocation = "#/weather?lat=35.652832&lon=139.839478"; //東京都

const currentLocation = function () {
  window.navigator.geolocation.getCurrentPosition((res) => {
    const { latitude, longitude } = res.coords;

    updataWeather(`lat=${latitude}`, `lon=${longitude}`);

    (err) => {
      window.location.hash = defaultLocation;
    };
  });
};

/**
 *@param {string} query
 **/
const searchedLocation = (query) => updataWeather(...query.split("&"));
const routes = new Map([
  ["/current-location", currentLocation],
  ["/weather", searchedLocation],
]);

const checkHash = function () {
  const requestURL = window.location.hash.slice(1);

  const [route, query] = requestURL.includes
    ? requestURL.split("?")
    : [requestURL];

  routes.get(route) ? routes.get(route)(query) : error404();
};

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function () {
  if (!this.window.location.hash) {
    window.location.hash = "#/current-location";
  } else {
    checkHash();
  }
});
