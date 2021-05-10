const puppeteer = require('puppeteer');
const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');


const writeStream = fs.createWriteStream('puppeteerScrape.csv');


(async()=>{
  const browser = await puppeteer.launch({headless:false}); //headless false to see type delay
  const page = await browser.newPage();
  
  await page.goto("https://youtube.com/");
  await page.waitForSelector(".style-scope.ytd-masthead");
  await page.waitForSelector("#search");
  await page.type("#search", "Marvel", {delay:100});
  await page.waitForSelector('#search-icon-legacy');
  await page.click('#search-icon-legacy');
  await page.waitForSelector('.text-wrapper.style-scope.ytd-video-renderer');
  const videoInfo = await page.evaluate(()=>{
    const videoTags = document.querySelectorAll('.text-wrapper.style-scope.ytd-video-renderer');
    const videoArray = [];
    videoTags.forEach(element =>{
      const videoTitle = element.querySelector('#video-title > yt-formatted-string').innerHTML;
      const views = element.querySelector('#metadata-line').children[0].innerText;
      const posted = element.querySelector('#metadata-line').children[1].innerText;
      const description = element.querySelector('#description-text').innerText;
      videoArray.push([videoTitle , views, posted, description]);
    });
    return videoArray
  });
  // console.log(videoInfo);


  const header = ['Video Title', 'Views', 'Posted', 'Description'];
  const csvFromArrayOfArrays = convertArrayToCSV(videoInfo, {
    header,
    separator: ''
  });
  writeStream.write(csvFromArrayOfArrays);
  
  await browser.close();
})();
