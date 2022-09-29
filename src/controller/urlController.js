const urlModel = require("../models/urlModel")
const baseUrl = 'http://localhost:3000'
const validUrl = require("valid-url");
const shortId = require("shortid");

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length > 0) return true;
    return false;
  };
  
  const createShortUrl = async function (req,res) {
    try{
        const data = req.body;
         if (Object.keys(data) == 0 ) {
            return res.status(400).send ({status: false, message: "please provide data in request body"})}
            const longurl = req.body.longUrl;
            const longUrl = longurl.toLowerCase();
            if  (!isValid(longUrl)) { return res.status(400).send({status: false, message: "please provide long url"})}
            if (!validUrl.isUri(longUrl)) { return res.status(400).send({status: false, message: "Enter valid url"})}
            if  (!isValid(baseUrl)) { return res.status(400).send({status: false, message: "please provide base url"})}
            if (!validUrl.isUri(baseUrl)) { return res.status(400).send({status: false, message: "Enter valid base url"})}

            let findUrl = await urlModel.findOne({ longUrl: longUrl }).select({__v: 0, _id: 0})
            if(findUrl)
                return res.status(200).send({status: true, message: "Already created short url for this long url", data: findUrl})
        
            const urlCode = shortId.generate()    
            const shortUrl = baseUrl + '/' + urlCode
    
            data.urlCode = urlCode
            data.shortUrl = shortUrl
    
            await urlModel.create({urlCode: urlCode, longUrl: longUrl, shortUrl: shortUrl})
            return res.status(201).send({status: true, message: "Successfully Shorten the URL.", data: {urlCode: urlCode, longUrl: longUrl, shortUrl: shortUrl}})


         }
         catch (error) {
            console.log(error)
            return res.status(500).send({ message: error.message })
        }
    }
  


    module.exports = { createShortUrl }