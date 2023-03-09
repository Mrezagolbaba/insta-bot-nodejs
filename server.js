const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/');

  // Login to Instagram
  await page.type('[name="username"]', 'your_username');//username
  await page.type('[name="password"]', 'your_password');//password
  await page.click('[type="submit"]');//submit button
  await page.waitForNavigation();//wait for navigation

  // Search for a hashtags
  const hashtags = ['programming', 'javascript', 'webdev'];
  const hashtag = hashtags[Math.floor(Math.random() * hashtags.length)];
  // change the hashtag to a random one after 20min 
  
  await page.goto(`https://www.instagram.com/explore/tags/${hashtag}/`);

  // Like and follow posts
  const posts = await page.$$('article > div:nth-child(3) button');
  //follow or like a post after 40min

  for (let i = 0; i < posts.length; i++) {
    try {
      // Check if post is already liked
      const isLiked = await posts[i].$eval('svg[aria-label="Unlike"]', node => node != null);
      
      if (!isLiked) {
        // Like the post
        await posts[i].click();
        console.log(`Post ${i + 1} liked!`);
      }

      // Follow the user
      const followButton = await posts[i].$('xpath=../..//button[text()="Follow"]');
      
      if (followButton) {
        await followButton.click();
        console.log(`User ${i + 1} followed!`);
      }
    } catch (error) {
      console.error(error);
    }
    
    // Wait for some time before liking/following next post
    await page.waitFor(1000 * 60 * 40);
  }

  // Close the browser
  await browser.close();
})();