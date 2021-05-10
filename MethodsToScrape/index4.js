const puppeteer = require('puppeteer');
const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');


const writeStream = fs.createWriteStream('puppeteerScrape.csv');


(async()=>{
  const browser = await puppeteer.launch(); //headless true for pdf
  const page = await browser.newPage();
  
  await page.goto("https://youtube.com/");
  await page.screenshot({ path: 'youtube.png' });
  await page.waitForSelector(".style-scope.ytd-masthead");
  await page.waitForSelector("#search");
  await page.type("#search", "Marvel");
  await page.waitForSelector('#search-icon-legacy');
  await page.click('#search-icon-legacy');
  await page.waitForSelector('.text-wrapper.style-scope.ytd-video-renderer');
  await page.screenshot({ path: 'youtube2.png' });
  await page.pdf({ path: 'youtube.pdf', format: 'a4' });
  const videoInfo = await page.evaluate(()=>{
    const videoTags = document.querySelectorAll('.text-wrapper.style-scope.ytd-video-renderer');
    const videoArray = [];
    videoTags.forEach(element =>{
      const videoTitle = element.querySelector('#video-title > yt-formatted-string').innerHTML;
      const views = element.querySelector('#metadata-line').children[0].innerText;
      const posted = element.querySelector('#metadata-line').children[1].innerText;
      const description = element.querySelector('#description-text').innerText;
      videoArray.push({video_title: videoTitle , views, posted, description});
    });
    return videoArray
  });
  // console.log(videoInfo);


  const csvFromArrayOfObjects = convertArrayToCSV(videoInfo);
  writeStream.write(csvFromArrayOfObjects);

  await browser.close();
})();
