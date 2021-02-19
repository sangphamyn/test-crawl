const cheerio = require('cheerio');
const fs = require("fs");
const request = require('request-promise');

request('https://www.24h.com.vn/bong-da/lich-thi-dau-bong-da-anh-c48a466567.html', (error, response, html) => {
  if(!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    var i = 0;

    $('.team-b').each((index, el) => {
      var job = $(el).find('p b font').text();
      i++;
      console.log(`${i}: ${job}`);
        fs.appendFile('input.txt', job + "\n",  function(err) {
          if (err) {
              return console.error(err);
          }
        });
    })
  }
  else {
    console.log(error);
  }
});
