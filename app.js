// app.js
var log4js = require('log4js');

var logger = log4js.getLogger(); 

var http = require('http');

// 配置log4js  
log4js.configure({
  appenders: { 
    clicks: {type: 'file', filename: './logs/clicks.log'}
  },
  categories: {
    default: {appenders: ['clicks'], level:'debug'}
  }    
});

http.createServer((req, res) => {

  if (req.url === '/') {

    // 返回页面 
    res.end(`
      <html>
        <body>
          <button id="mybtn">Click</button>  
          <script>
            function handleClick() {
              alert("you!")
              fetch('/api/click'); 
            }
            document.getElementById("mybtn").onclick = handleClick;
          </script>
        </body>
      </html>
    `);

  } else if (req.url === '/api/click') {

     // Send log to Sentinel
    fetch("https://XXX.endpoint.sentinel.azure.com/api/logs", {
      method: "POST",
      body: JSON.stringify({
        timestamp: Date.now(),
        message: "Button clicked"
      })
    });
    // 点击事件接口 
    logger.info("I clicked!");
    console.log("read it");
    res.end();
  
  }

}).listen(3000);