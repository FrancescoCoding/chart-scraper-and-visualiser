![Harvest Logo](https://user-images.githubusercontent.com/64712227/141352718-ac2ddea4-41fb-4a65-b0ec-1ef223d929ef.png)

# Harvest Time - Node Web Scraper
> I generated Harvest Time's logo for fun with a neural network combination of VQGAN + CLIP. [Evolution >](https://files.catbox.moe/6p4sp5.mp4).
  
This is a Node application that uses Puppeteer to scrape information from websites.   
Puppeteer drives headless Chrome over the DevTools Protocol, allowing you to build robust, high-quality scrapers and obtain information from websites protected by giving credentials for user login directly to the code.

### Harvest Time is a Node-based web scraper that utilizes [Puppeteer](https://github.com/puppeteer/puppeteer) to get past the login page directly from the Node environment, and obtain its data.



## Why create this?
I wanted to work with all the dates and information contained in my university Timetable.  
You cannot simply give a URL to a scraper if the content is protected by a login page, and I wanted to pass the login directly from my code. That is where Puppeteer comes in.

# Usage
#### To run this project on your local machine, run the command below to install all the dependencies:

### `npm i`

### Run the server:

```bash
npm run start
```
### Logging to a page with Puppeteer:
You need a few things to get past the login of the page you are scraping from:  
  - You have to change name and password in the credential object to your own credentials.
    
    ![image](https://user-images.githubusercontent.com/64712227/141340395-e5517a0a-bad1-4502-96b9-62c54c40b61a.png)

  - You will also need to indicate the page's login input elements (username and password input fields) and the login button.
  - Ideally you want to pass a JavaScript DOM selector to it.   

    ![image](https://user-images.githubusercontent.com/64712227/141343032-cd926412-ae85-4553-8241-84ff9d1b7684.png)
    
    - These will be filled out and requested directly by the function.
    - For example, if the name input of the page has a name **class**, you would simply specify **".name"**, if you only have an **ID**, this is the syntax: **"#name"**.
    - You can find this information direcly in the Chrome developer tools:

    ![image](https://user-images.githubusercontent.com/64712227/141344307-f1f061ba-f3d6-4a07-b5cf-8de0fae85497.png) 

### Changing the server port:
Change the server port to your liking (I was using port 8000).

  ![image](https://user-images.githubusercontent.com/64712227/141346765-f7552a00-0cd4-4ba1-b24b-472e7980aed2.png)


### Working with the Document Object Model:
You can now play with the DOM of the requested page, and select its elements, within the ```page.evaluate()``` function.

   ![image](https://user-images.githubusercontent.com/64712227/141345782-66792ab8-6bec-4f62-b188-9e7ec8b3c947.png)
   
### Generating PNG or PDF page snapshot
The function generates a page snapshot automatically (.png 1080p) and can also generate a pdf easily.  
All you have to do is to pass ```createPdf = true``` or ```createPng = true``` to the function.
The files will be saved in the root directory.

# Improvements
I will create an IDE for this at some point and connect it to a React page.  
Some further improvements to be made is removing some of my specific pieces of code (that were relevant to my particular scraping) from the function, but this won't take too long.

