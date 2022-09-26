const express = require('express')
const app = express()
const process = require('process')
const port = process.env.PORT || 5000
const cors = require('cors')
const path = require('path')
const fs = require("fs")


const rootFile = path.join(__dirname,"public/index.html")
const dataFile = 'datafile.txt'

const errorMsg = "502 Internal server error"
fs.open(dataFile,'a',()=>console.log("Created a file"))

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))

console.log(`********** app settings *************`)
console.log(process.env)

app.get('/',(req,res)=>{
    console.log(`******* The root file is ${rootFile} and __dirname is ${__dirname}`)
    res.sendFile(datatestfile)
})

app.get('/',(req,res)=>{
    console.log(`******* Hello *****`)
})

app.get('/items',(req,res)=>{
    let stgData = {}
    try {
        stgData = fs.readFileSync(dataFile,'utf-8')
        let resData = stgData.split(",")
        console.log(`*** [GET] *** ${req.url}`)
        res.status('200').json(resData)
    }catch(e){
        console.log(`Error fetching data from disk. ${e}`)``
        res.status('500').send(errorMsg)
    }
})

app.post('/items',(req,res)=>{
    let textItem = ""
    try{
        console.log(`*** [POST] *** ${req.url} ${req.body.data}`)
        textItem = textItem.concat(req.body.data)+','
        fs.appendFileSync(dataFile,textItem)
        res.status('200').json(req.body.data)
    }catch (e){
        console.log(`Error writing data to file on disk. ${e}`)
        res.status('500').send(errorMsg)
    }
})

app.delete('/items',(req,res)=>{
    try{
        fs.writeFileSync(dataFile,"")
        res.status('200').send('Deleted all data')
    }catch(e){
        console.log(`Error deleting datafile ${e}`)
        res.status('502').send(errorMsg)
    }
})

app.get('/bindcpu/:limit',(req,res)=>{
    console.log(req.url)
    let rangeLimit = req.params.limit
    let meaningless = 0
    for (i=2;i<rangeLimit;i++){
        for (j=2;j<rangeLimit;j++){
                meaningless += 1*j
        }
    }
    console.log(`Done with meaningless task : ${meaningless}`)
    res.status(200).json({num:meaningless})
})

let mem_f = []
app.get('/bindmem/:limit',(req,res)=>{
    console.log(req.url)
    let rangeLimit = req.params.limit
    for (i=2;i<rangeLimit;i++){
        mem_f.push(1*rangeLimit)
    }
    console.log(`Done with mem_f : ${mem_f}`)
    res.status(200).json({num:mem_f})
})

app.get('/stop',(req,res)=>{
    console.log("Force exiting app (-1)")
    process.exit(-1)
})


app.post('/images',(req,res)=>{
    console.log(`image upload req received`)
    console.log(req)
    res.send('received')
})


let server = app.listen(port, ()=>{
    console.log(`Started server. Listening on:${port}`)
})


