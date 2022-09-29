const urlModel = require("../models/urlModel")
const baseUrl = 'http://localhost:3000'
const validUrl = require("valid-url");
const shortId = require("shortid");

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length > 0) return true;
    return false;
  };
  
  const shortUrl = async function (req,res) {
    try{
        const data = req.body;
         if (Object.keys(data) == 0 ) {
            return res.status(400).send ({status: false, message: "please provide data in request body"})}
            const longUrl = req.body.longUrl;
            const isUrl = longUrl.toLowerCase();
            if  (!isValid(isUrl)) { return res.status(400).send({status: false, message: "please provide long url"})}
            if (!validUrl.isUri(isUrl)) { return res.status(400).send({status: false, message: "Enter valid url"})}
            if  (!isValid(baseUrl)) { return res.status(400).send({status: false, message: "please provide base url"})}
            if (!validUrl.isUri(baseUrl)) { return res.status(400).send({status: false, message: "Enter valid base url"})}

         }
         catch (error) {
            console.log(error)
            return res.status(500).send({ message: error.message })
        }
    }
  