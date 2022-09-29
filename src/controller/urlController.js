const urlModel = require("../models/urlModel")
const shortid = require("shortid")
const validURL = require("valid-url")



const createShortURL = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body should not be empty" })
        }
        let longUrl = data.longUrl.toLowerCase()
        if (!longUrl) return res.status(400).send({ satus: false, message: "longUrl is mandatory" })
        if (!validURL.isUri(longUrl)) return res.status(400).send({ status: false, message: "please enter the valid URL" })
        let UrlExist = await urlModel.findOne({ longUrl: longUrl })
        if (UrlExist) {
            //let URL = UrlExist.shortUrl
            return res.status(400).send({ status: false, message: "Given longUrl already exists" })
        }
        let ID = shortid.generate()
        let Objects = { urlCode: ID, longUrl: longUrl, shortUrl: `http://localhost:3000/${ID}` }
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

        let findUrl = await urlModel.findOne({ urlCode: urlCode }).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        return res.status(200).send({ status: true, data: findUrl });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
};



<<<<<<< HEAD





module.exports.createShortURL = createShortURL
=======
module.exports.createShortURL = createShortURL
module.exports.getUrlCode = getUrlCode
>>>>>>> 14500a9b26cb61e376cadf97d72858b4052f8b31
