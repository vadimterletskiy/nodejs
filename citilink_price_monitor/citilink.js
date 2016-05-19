console.log('citilink price monitor')
fs = require('fs')

function readLines(input, func) {
    var remaining = '';

    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            func(line);
            index = remaining.indexOf('\n');
        }
    });

    input.on('end', function() {
        if (remaining.length > 0) {
            func(remaining);
            sleep(1)
        }
    });
}

var input = fs.createReadStream('links.txt');
readLines(input, doLink);

// Count all of the links from the io.js build page
var jsdom = require("jsdom");

function doLink(url) {
    url = url.replace(/(\r\n|\n|\r)/gm, "") + "?action=changeCity&space=nnov_cl:"
    console.log("Try parce URL: <" + url + ">")
    var d = new Date();
    jsdom.env({
        url: url,
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function(err, window) {
            var $ = window.$;
            var fileName = ''
            $(".product_header h1:first .invisible_text").each(function() {
                p = $(this).parent()
                $(this).remove()
                fileName = p.text().trim() + '.txt';
                console.log("Header: <", fileName + ">");
            });

            $("section[data-gtm-location='Карточка товара'] .club_price .price_block .price_details .price").each(function() {
                console.log($(this).text());
                price = $(this).text().trim()
                fs.appendFile(fileName, d + "\t" + price + '\r\n', function(err) {
                    console.log(err);
                });
                //console.log("\n\n\n")
            });
        }
    });
}
