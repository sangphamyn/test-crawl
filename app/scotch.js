const _ = require('lodash');
// Import helper functions
const {
  compose,
  composeAsync,
  extractNumber,
  enforceHttpsUrl,
  fetchHtmlFromUrl,
  extractFromElems,
  fromPairsToObject,
  fetchElemInnerText,
  fetchElemAttribute,
  extractUrlAttribute
} = require("./helpers");
// scotch.io (Base URL)
const SCOTCH_BASE = "https://scotch.io";
///////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////
/*
  Resolves the url as relative to the base scotch url
  and returns the full URL
 /
const scotchRelativeUrl = url =>
  _.isString(url) ? `${SCOTCH_BASE}${url.replace(/^\/*?/, "/")}` : null;
/_*
 _ A composed function that extracts a url from element attribute,
 _ resolves it to the Scotch base url and returns the url with https
 */
const extractScotchUrlAttribute = attr =>
  compose(enforceHttpsUrl, scotchRelativeUrl, fetchElemAttribute(attr));

  ///////////////////////////////////////////////////////////////////////////////
// EXTRACTION FUNCTIONS
///////////////////////////////////////////////////////////////////////////////
/_*
_ Extract a single social URL pair from container element
*/
const extractSocialUrl = elem => {
 // Find all social-icon <span> elements
 const icon = elem.find('span.icon');
 // Regex for social classes
 const regex = /^(?:icon|color)-(.+)$/;
 // Extracts only social classes from the class attribute
 const onlySocialClasses = regex => (classes = '') => classes
     .replace(/\s+/g, ' ')
     .split(' ')
     .filter(classname => regex.test(classname));
 // Gets the social network name from a class name
 const getSocialFromClasses = regex => classes => {
   let social = null;
   const [classname = null] = classes;
   if (_.isString(classname)) {
     const _[_, name = null] = classname.match(regex);
     social = name ? _.snakeCase(name) : null;
   }
   return social;
 };
 // Extract the href URL from the element
 const href = extractUrlAttribute('href')(elem);
 // Get the social-network name using a composed function
 const social = compose(
   getSocialFromClasses(regex),
   onlySocialClasses(regex),
   fetchElemAttribute('class')
 )(icon);
 // Return an object of social-network-name(key) and social-link(value)
 // Else return null if no social-network-name was found
 return social && { [social]: href };
};