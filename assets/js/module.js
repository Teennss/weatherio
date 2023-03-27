"use strict";

export const weekDayNames = [
  "日曜日",
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
];

export const monthNames = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

/**
 *@param {number} dateUnix
 *@param {number} timezone
 *@returns {string}
 **/
export const getDate = function (dateUnix, timezone) {
  const date = new Date((dateUnix + timezone) * 1000);
  const weekDayName = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];

  return `${weekDayName}, ${monthName} ${date.getUTCDate()}日`;
};

/**
 *@param {number} timeunix
 *@param {number} timezone
 *@returns {string}
 **/

export const getTime = function (timeUnix, timezone) {
  const date = new Date((timeUnix + timezone) * 1000);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  hours = hours < 10 ? "0" + hours : hours;

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${formattedMinutes}${period}`;
};

/**
 *@param {number} timeunix
 *@param {number} timezone
 *@returns {string}
 **/

export const getHours = function (timeUnix, timezone) {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours();
  const period = hours >= 12 ? "PM" : "AM";

  return `${hours % 12 || 12} ${period}`;
};

/**
 *@param {number} mps
 *@returns {number}
 **/

export const mps_to_kmh = (mps) => {
  const mph = mps * 3600;
  return mph / 1000;
};

export const aqiText = {
  1: {
    level: "良い",
    message: "空気の品質は満足で、空気汚染はほとんどリスクを引き起こしません",
  },
  2: {
    level: "普通",
    message:
      "空気の品質は許容できますが、一部の汚染物質は中程度に高い場合があります。これは、空気汚染に特に敏感な人々にとって健康上の懸念を引き起こす可能性があります。",
  },
  3: {
    level: "中程度",
    message:
      "呼吸器や心臓疾患を持つ人など、感受性の高いグループのメンバーは健康上の影響を受ける可能性があります。一般の人々には影響が少ないです。",
  },
  4: {
    level: "不健康",
    message:
      "すべての人々がいくらかの健康上の影響を経験する可能性があり、感受性の高いグループのメンバーはより深刻な影響を受ける可能性があります。",
  },
  5: {
    level: "非常に不健康",
    message:
      "健康警告：緊急状況が発生する可能性があります。全人口がより影響を受ける可能性があります。",
  },
};
