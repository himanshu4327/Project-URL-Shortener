const urlModel = require("../models/urlModel")
const shortid = require("shortid")
const validURL = require("valid-url")
const baseURL = "http://localhost:3000"
const redis = require("redis");
const { promisify } = require("util");


//Connect to redis
const redisClient = redis.createClient(
    10029,
    "redis-10029.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("yueHvqVlYjxIbAQ9vWHer4CRZfvPcKr1", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });
  

  //1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);



const createShortURL = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body should not be empty" })
        }
        let longUrl = data.longUrl.toLowerCase()
        if (!longUrl) return res.status(400).send({ satus: false, message: "longUrl is mandatory" })
        if (!validURL.isUri(longUrl)) return res.status(400).send({ status: false, message: "please enter the valid longURL" })
        if (!validURL.isUri(baseURL)) return res.status(400).send({ status: false, message: "please enter the valid baseURL" })

        let  cahcedurlData = await GET_ASYNC(`${longUrl}`)
        if (cahcedurlData) { return res.status(200).send({ status: true, data: JSON.parse(cahcedurlData) }) }


        let UrlExist = await urlModel.findOne({ longUrl: longUrl })
        if (UrlExist) { 
            await SET_ASYNC(`${longUrl}`, JSON.stringify(UrlExist));
            //let URL = UrlExist.shortUrl
            return res.status(400).send({ status: false, message: "Given longUrl already exists", data: UrlExist })
        }

        let ID = shortid.generate()
        const shortUrl = baseURL + '/' + ID

        
        let Objects = { urlCode: ID, longUrl: longUrl, shortUrl: shortUrl }
        let savedData = await urlModel.create(Objects)
        let Obj = { urlCode: savedData.urlCode, longUrl: savedData.longUrl, shortUrl: savedData.shortUrl }
        return res.status(201).send({ status: true, data: Obj })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getUrlCode = async function (req, res) {
    try {
        let urlCode = req.params.urlCode;
        let cachedurlcodeData = await GET_ASYNC(`${urlCode}`)
        if (cachedurlcodeData) { return res.status(302).redirect(JSON.parse(cachedurlcodeData)) }
        
        let findUrl = await urlModel.findOne({ urlCode: urlCode })
        if(!findUrl){

            return res.status(404).send({status:false, message:"URL document not found"})
        }
        await SET_ASYNC(`${urlCode}`, JSON.stringify(findUrl.longUrl))
        return res.status(302).redirect(findUrl.longUrl)

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
};



module.exports.createShortURL = createShortURL
module.exports.getUrlCode = getUrlCode