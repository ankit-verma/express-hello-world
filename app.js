const express = require("express");
const bodyParser = require('body-parser')

const axios = require("axios");
const app = express();

const storeConfig = {
    url: "99apps.myshopify.com",
    apiVersion: "2022-10",
    token: "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" 
}

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
// POST /login gets urlencoded bodies
//app.post('/login', urlencodedParser, function (req, res) {
  //res.send('welcome, ' + req.body.username)
//})
 
// POST /api/users gets JSON bodies
//app.post('/api/users', jsonParser, function (req, res) {
  // create user in req.body
//})


//app.get("/", (req, res) => res.type('html').send(html));

app.post("/customJob", jsonParser, async (req, res) => {

    const token = req.headers.token;
    //const msg = "unauthorized";
    //res.status(401).send(msg);
    //res.type('html').send("ok:customJob");
    const data = req.body;
    //console.log("token",token);
    //console.log("data",data);
    let response = "not invoked";

    if(data.variants[0].inventory_quantity < 1 && data.status == "active"){
        response = await productUpdate(data.id);
    }
    res.status(200).send(response);
});

async function productUpdate(id){
    const productId = id;
    
    const url = `https://${storeConfig.url}/admin/api/${storeConfig.apiVersion}/products/${productId}.json`;

    const payload = `{
        "product":{"id":${productId},"status":"draft"}
    }`;

    const headers = {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': storeConfig.token
    };
    //console.log("payload",payload);
    //console.log("url",url);
    //console.log("payload",payload);

    const config = {
        method: 'put',
        url: url,
        headers: headers,
        data: payload
    };

    try {
        const response = await axios(config);
        const data = response.data;

        if(data && data.id && data.id.length > 0){
            return {
                status: 200,
                statusText: 'sent to shopify',
                data: data
            }
        }
        else {
            return {
                status: 500,
                statusText: 'error sending to shopify'
            }
        }
    } catch (err) {
        return {
            status: 500,
            statusText: 'error sending to shopify',
            errors: err
        }
    }
}
      
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


const html = `ok`;
