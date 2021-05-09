const axios = require('axios');
const cheerio = require('cheerio');
const json2csv = require('json2csv').Parser;
const fs = require('fs');


(async()=>{
  let shoes = [];
  let config = {
    method: "get",
    url : `https://www.flipkart.com/search?q=shoes&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`,
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Cookie":` T=TI162032905667700102470267621477069454284343184204086889927717903942; Network-Type=4g; _pxvid=a7160350-aea0-11eb-b07a-0242ac120006; AMCVS_17EB401053DAF4840A490D4C%40AdobeOrg=1; s_cc=true; AMCV_17EB401053DAF4840A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C18754%7CMCMID%7C30734325750271073343035898223382462927%7CMCAAMLH-1620933858%7C12%7CMCAAMB-1620933858%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1620336259s%7CNONE%7CMCAID%7CNONE; s_sq=%5B%5BB%5D%5D; qH=b0a8b6f820479900; SN=VI423E721736AA4B23B15A03E24A7F6A4F.TOK0148BE1D43C64BF9B9B406DC825436FD.1620370483.LO; gpv_pn=Search%20%3AFootwear; gpv_pn_t=Search%20Page; _px3=679c4bb8461f0a334aa8a4875e7ccb9578794998402317e85bd1af886dd18af2:au/RP5+JSIxu07AmtLKcU5BgwXG8uX+5kuQNl7/K53WSACP0M5yiJgakFDITrOBPOsAFwXWOZaYNPHWMBDxqdA==:1000:nnYVGKZRvlG0CqC6Mpu9+wnPC+oNJTsCin2ZU5NM9VwkqEsvcxwYNg4gSrTC0ohI+IEHW3epspyck7llr7sBJ3t9yPz2ILl9GNh1dHNHgf4Js+APnJ1CNyKbh+wRTOtFho8+kHAYred5GUdt4U50+xy4p8OWen8mYiJy6P5gS8A=; S=d1t17P2s/Txk/Gz9FPz8/Qj9WP+GYi7BosjtgYjW/KiMYwBDe14lVkYaqoZZp+9xr8eMfOym5wbQ+lCuDSPhuy11e2w==`,
        "Host": "www.flipkart.com",
        "sec-ch-ua": `" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"`,
        "sec-ch-ua-mobile": "?0",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    }
  };

  const response = await axios(config)
    .then(function (response) {
    //   console.log(response.data);
    const $ = cheerio.load(response.data);
    $("div._1xHGtK").each((index, element)=>{
        const comp = $(element).find('div._2WkVRV').text();
        const name = $(element).find('a.IRpwTa').text().replace(/,/g, " ");
        const price = $(element).find('div._30jeq3').text().replace(/,/g, "");
        const originalPrice = $(element).find('div._3I9_wc').text().replace(/,/g, "");
        const discount = $(element).find('div._3Ay6Sb>span').text();
        // console.log(comp +' '+ name+ ' ' + price+' '+originalPrice+' '+discount);
        shoes.push({brand: comp,
          name, price, originalPrice, discount
        });
    });
    console.log(`Scraping Done...`);
    
    })
    .catch(function (error) {
      console.log(error);
    });

    const j2csv = new json2csv();
    const csv = j2csv.parse(shoes);

    fs.writeFileSync("scrap2.csv", csv, "utf-8");
})();
