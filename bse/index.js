const BSEAPI = require('./service/bseAPI');
var emptyData = require('./constant/emptyData');

/**
 * API returning top indices
 * @returns {*}
 */
function getIndices() {
  return BSEAPI.getIndices();
}

/**
 * Fetch Index info, eg., high, low, open etc…
 * @param symbolKey {number} Index 'key' value
 * @returns {*}
 */
function getIndexInfo(symbolKey) {
  return BSEAPI.getIndexInfo(symbolKey);
}

/**
 * Get Full Day Chart data for a index
 * @param key {number} = use the index 'key' value (check getIndices method, every index has a key value)
 * @param time = {1|1M|3M|6M|12M}
 * @returns {*}
 */
function getIndexChartData(key, time) {
  return BSEAPI.getIndexChartData(key, time);
}

/**
 * Get HeatMap data for index (stock list for a index)
 * @param symbolKey {number} pass in the 'key' value for index (check getIndices method)
 * @returns {*}
 */
function getIndexStocks(symbolKey) {
  return BSEAPI.getIndexStocks(symbolKey);
}

/**
 *  API returning Company Info
 * @param securityCode {number} BSE, company securityCode value
 * @returns {Promise}
 */
function getCompanyInfo(securityCode) {
  return BSEAPI.getCompanyInfo(securityCode)
    .then(function (response) {
      return new Promise(function (resolve, reject) {
        if (response.length === 3) {
          resolve(Object.assign(emptyData.emptyCompanyInfo, response[0].data, response[1].data, response[2].data))
        } else {
          reject(emptyData.emptyCompanyInfo);
        }
      });
    }).catch(function (reason) {
      console.log(reason);
      // return new Promise.reject(reason);
    });
}

/**
 *  API returning Company Info
 * @param securityCode {number} BSE, company securityCode value
 * @param flag {string}, oneOf [1D,5D,1M,3M,6M,12M]
 * @returns {*}
 */
function getStocksChartData(securityCode, flag) {
  return BSEAPI.getStocksChartData(securityCode, flag);
}

/**
 *  API returning Daily Stocks data of company
 * @param securityCode {number} BSE, company securityCode value
 * @returns {*}
 */
function getStockInfoAndDayChartData(securityCode) {
  return BSEAPI.getStockInfoAndDayChartData(securityCode);
}

/**
 * API returning top Gainers of day
 * @returns {*}
 */
function getGainers() {
  return BSEAPI.getGainers();
}

/**
 * API returning top Losers of day
 * @returns {*}
 */
function getLosers() {
  return BSEAPI.getLosers();
}

/**
 * API returning top turnovers of day
 * @returns {*}
 */
function getTopTurnOvers() {
  return BSEAPI.getTopTurnOvers();
}

/**
 * Returns stock buy and sell quantity
 * @param securityCode
 * @returns {*}
 */
function getStockMarketDepth(securityCode) {
  return BSEAPI.getStockMarketDepth(securityCode);
}

var bse = {
  getIndices: getIndices,
  getIndexInfo: getIndexInfo,
  getIndexChartData: getIndexChartData,
  getIndexStocks: getIndexStocks,
  getCompanyInfo: getCompanyInfo,
  getStocksChartData: getStocksChartData,
  getStockInfoAndDayChartData: getStockInfoAndDayChartData,
  getGainers: getGainers,
  getLosers: getLosers,
  getTopTurnOvers: getTopTurnOvers,
  getStockMarketDepth: getStockMarketDepth
};

module.exports = bse;
