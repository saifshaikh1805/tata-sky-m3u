# Tata Sky m3u generator web app

A react web app to generate an m3u playlist for the channels subscribed on Tata Sky.

## Steps to use (You will need an account on Vercel. It's free!)
1) Click the button below to deploy <a href="https://github.com/saifshaikh1805/tata-sky-m3u-dynamic">this</a> serverless function to Vercel.<br>
<a href="https://vercel.com/new/clone?repository-url=https://github.com/saifshaikh1805/tata-sky-m3u-dynamic.git"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>
2) After deploying the serverless function, copy it's domain. You can find it in your newly deployed project on Vercel.
3) Now, clone this repo
4) Create .env file in root directory
5) Add the following line in the .env file:
  ```
  REACT_APP_M3U_FUNCTION_BASE_URL = <THE DOMAIN YOU COPIED IN STEP 2. PUT IT HERE DOUBLE QUOTES>
  ```
7) npm install
8) npm start
9) Login with your Tata sky account
10) Generate m3u URL
11) Enjoy!

Once you generate the m3u URL, you don't need to do it every 24 hours. It will automatically generate fresh JWT on every request.

### Feel free to contribute :smiley:
