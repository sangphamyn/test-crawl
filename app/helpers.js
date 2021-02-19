const _ = require('lodash');
const axios = require("axios");
const cheerio = require("cheerio");

/**
 **_ Handles the request(Promise) when it is fulfilled
 _** and sends a JSON response to the HTTP response stream(res).
 */
const sendResponse = res => async request => {
    return await request
      .then(data => res.json({ status: "success", data }))
      .catch(({ status: code = 500 }) =>
        res.status(code).json({ status: "failure", code, message: code == 404 ? 'Not found.' : 'Request failed.' })
      );

/**
 _ Loads the html string returned for the given URL
 _ and sends a Cheerio parser instance of the loaded HTML
 */
const fetchHtmlFromUrl = async url => {
    return await axios
      .get(enforceHttpsUrl(url))
      .then(response => cheerio.load(response.data))
      .catch(error => {
        error.status = (error.response && error.response.status) || 500;
        throw error;
      });
  };