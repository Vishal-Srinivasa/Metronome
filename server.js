const escapeRegExp = require('lodash.escaperegexp')
var MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const fs = require('fs')
const express = require('express')
const app = express()

app.use(express.static('metronome'))

var url = "mongodb://localhost:27017"
let client
let react_states = {tempo : 60, num : 4, note : 4, sub_div : 1, tone_arr : [2,2,2,2], cur_num : 0, poly_switch : false, poly_num : 4, rhytnr_switch : false, play_bars : 1, mute_bars : 1, pracmod_switch : false, every : 4, increase_by : 1, start_tempo : 100, max_tempo : 140}
let username = ""

console.log(__dirname)
app.get('/', function(req, res){
    res.sendFile(__dirname + "/login.html")
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/login', function(req, res){
    MongoClient.connect(url)
        .then((connectedClient) => {
            client = connectedClient
            const dbo = client.db("Metronome")
            return dbo.collection("LoginDetails").find({username : req.body.username}, { projection: { _id : 0, password : 1 } }).toArray()	
        })
        .then((returned_password) => {
            console.log(returned_password)
            if (req.body.login_flag == 1) {
                if (returned_password.length != 0 && returned_password[0].password == req.body.password){
                    console.log("going to main from login")
                    username = req.body.username
                    res.sendFile(__dirname + "/main_react.html")
                }
                else {
                    console.log("going to login from login")
                    res.sendFile(__dirname + "/login.html")
                }
            }
            else {
                console.log(returned_password.length)
                if (returned_password.length == 0){
                    console.log("going to main from signup")
                    MongoClient.connect(url)
                        .then((connectedClient) => {
                            client = connectedClient
                            const dbo = client.db("Metronome")
                            const data = { username: req.body.username, password: req.body.password }
                            const collection = dbo.collection("LoginDetails")
                            return collection.insertOne(data)
                        })
                        .then((result) => {
                            username = req.body.username
                            res.sendFile(__dirname + "/main_react.html")
                            client.close()
                        })
                        .catch((err) => {
                            console.error("An error occurred:", err)
                        })
                }
                else {
                    console.log("going to login from signup")
                    res.sendFile(__dirname + "/login.html")
                }
            }
            client.close()
        })
        .catch((err) => {
            console.error("An error occurred:", err)
        })       
})


app.get("/main_react.html", function(req, res) {
    res.sendFile(__dirname + "/main_react.html")
})

app.get("/main/react_states", function(req, res){
    res.json({all_states : react_states, tempo : react_states.tempo})
})

app.post('/main/double_inc', (req, res) => {
    react_states.tempo = req.body.variable
    res.sendFile(__dirname + "/main_react.html")
})

app.post('/main/single_inc', (req, res) => {
    react_states.tempo = req.body.variable
    res.sendFile(__dirname + "/main_react.html")
})

app.post('/main/single_dec', (req, res) => {
    react_states.tempo = req.body.variable
    res.sendFile(__dirname + "/main_react.html")
})

app.post('/main/double_dec', (req, res) => {
    react_states.tempo = req.body.variable
    res.sendFile(__dirname + "/main_react.html")
})

app.get('/audio0', function(req, res) {
    const audioFile = fs.createReadStream(__dirname + '/audiofiles/tone0.wav')
    audioFile.pipe(res)
    res.setHeader('Content-Type', 'audio/wav')
})

app.get('/audio1', function(req, res) {
    const audioFile = fs.createReadStream(__dirname + '/audiofiles/tone1.wav')
    audioFile.pipe(res)
    res.setHeader('Content-Type', 'audio/wav')
})

app.get('/audio2', function(req, res) {
    const audioFile = fs.createReadStream(__dirname + '/audiofiles/tone2.wav')
    audioFile.pipe(res)
    res.setHeader('Content-Type', 'audio/wav')
})

app.get('/audio3', function(req, res) {
    const audioFile = fs.createReadStream(__dirname + '/audiofiles/tone3.wav')
    audioFile.pipe(res)
    res.setHeader('Content-Type', 'audio/wav')
})

app.get("/ts_react.html", function(req, res) {
    res.sendFile(__dirname + "/ts_react.html")
})

app.post('/ts/num_inc', (req, res) => {
    react_states.num = req.body.variable
    res.sendFile(__dirname + "/ts_react.html")
})

app.post('/ts/num_dec', (req, res) => {
    react_states.num = req.body.variable
    res.sendFile(__dirname + "/ts_react.html")
})

app.post('/ts/note_inc', (req, res) => {
    react_states.note = req.body.variable
    res.sendFile(__dirname + "/ts_react.html")
})

app.post('/ts/note_dec', (req, res) => {
    react_states.note = req.body.variable
    res.sendFile(__dirname + "/ts_react.html")
})

app.post('/ts/sd1', (req, res) => {
    react_states.sub_div = req.body.variable
    res.sendFile(__dirname + "/ts_react.html")
})

app.post('/ts/sd2', (req, res) => {
    react_states.sub_div = req.body.variable
    res.sendFile(__dirname + "/ts_react.html")
})

app.post('/ts/sd3', (req, res) => {
    react_states.sub_div = req.body.variable
    res.sendFile(__dirname + "/ts_react.html")
})

app.post('/ts/sd4', (req, res) => {
    react_states.sub_div = req.body.variable
    res.sendFile(__dirname + "/ts_react.html")
})

app.post('/ts/sd5', (req, res) => {
    react_states.sub_div = req.body.variable
    res.sendFile(__dirname + "/ts_react.html")
})

app.post('/ts/sd6', (req, res) => {
    react_states.sub_div = req.body.variable
    res.sendFile(__dirname + "/ts_react.html")
})

app.get("/poly_react.html", function(req, res) {
    res.sendFile(__dirname + "/poly_react.html")
})

app.post('/poly/toggle', (req, res) => {
    react_states.poly_switch = req.body.variable
    res.sendFile(__dirname + "/poly_react.html")
})

app.post('/poly/poly_inc', (req, res) => {
    react_states.poly_num = req.body.variable
    res.sendFile(__dirname + "/poly_react.html")
})

app.post('/poly/selected', (req, res) => {
    react_states.cur_num = req.body.variable
    res.sendFile(__dirname + "/poly_react.html")
})

app.post('/poly/tone_inc', (req, res) => {
    react_states.tone_arr = req.body.variable
    res.sendFile(__dirname + "/poly_react.html")
})

app.post('/poly/tone_dec', (req, res) => {
    react_states.tone_arr = req.body.variable
    res.sendFile(__dirname + "/poly_react.html")
})

app.post('/poly/poly_dec', (req, res) => {
    react_states.poly_num = req.body.variable
    res.sendFile(__dirname + "/poly_react.html")
})

app.get("/rhytm_react.html", function(req, res) {
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/toggle', (req, res) => {
    react_states.rhytnr_switch = req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/play_inc', (req, res) => {
    react_states.play_bars = req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/play_dec', (req, res) => {
    react_states.play_bars = req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/mute_inc', (req, res) => {
    react_states.mute_bars = req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/mute_dec', (req, res) => {
    react_states.mute_bars = req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/toggle1', (req, res) => {
    react_states.pracmod_switch = req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/every_inc', (req, res) => {
    react_states.every = req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/every_dec', (req, res) => {
    react_states.every = req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/increase_inc', (req, res) => {
    react_states.increase_by= req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/increase_dec', (req, res) => {
    react_states.increase_by= req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/start_inc', (req, res) => {
    react_states.start_tempo= req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/start_dec', (req, res) => {
    react_states.start_tempo= req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/max_inc', (req, res) => {
    react_states.max_tempo= req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.post('/rhythm/max_dec', (req, res) => {
    react_states.max_tempo= req.body.variable
    res.sendFile(__dirname + "/rhytm_react.html")
})

app.get("/timesig_mount", function(req,res){
    res.json({num : react_states.num, note : react_states.note})
})

app.get("/sub_div_mount", function(req,res){
    res.json({sub_div : react_states.sub_div})
})

app.get("/tone_mount", function(req,res){
    res.json({tone_arr : react_states.tone_arr})
})

app.get("/rhytnr_mount", function(req,res){
    res.json({rhytnr_switch : react_states.rhytnr_switch, play_bars : react_states.play_bars, mute_bars : react_states.mute_bars})
})

app.get("/pracmod_mount", function(req,res){
    res.json({pracmod_switch : react_states.pracmod_switch, every : react_states.every, increase_by : react_states.increase_by, start_tempo : react_states.start_tempo, max_tempo : react_states.max_tempo})
})

app.get("/poly_mount", function(req,res){
    res.json({poly_switch : react_states.poly_switch, poly_num : react_states.poly_num})
})

app.get("/save_react.html", function(req, res) {
    res.sendFile(__dirname + "/save_react.html")
})

app.post("/save", function(req, res) {
    MongoClient.connect(url)
        .then((connectedClient) => {
            client = connectedClient
            const dbo = client.db("Metronome")
            const data = { user_name : username , tempo : react_states.tempo , num : react_states.num, note : react_states.note, sub_div : react_states.sub_div, tone_arr : react_states.tone_arr, cur_num : react_states.cur_num, poly_switch : react_states.poly_switch, poly_num : react_states.poly_num, rhytnr_switch : react_states.rhytnr_switch, play_bars : react_states.play_bars, mute_bars : react_states.mute_bars, pracmod_switch : react_states.pracmod_switch, every : react_states.every, increase_by : react_states.increase_by, start_tempo : react_states.start_tempo, max_tempo : react_states.max_tempo, save_name: req.body.save_name, save_type: req.body.save_type }
            const collection = dbo.collection("Saved")
            return collection.insertOne(data)
        })
        .then((result) => {
            client.close()
        })
        .catch((err) => {
            console.error("An error occurred:", err)
        })
    if (req.body.save_type == "Public"){
        MongoClient.connect(url)
            .then((connectedClient) => {
                client = connectedClient
                const dbo = client.db("Metronome")
                console.log(react_states)
                const data = { user_name : username , tempo : react_states.tempo , num : react_states.num, note : react_states.note, sub_div : react_states.sub_div, tone_arr : react_states.tone_arr, cur_num : react_states.cur_num, poly_switch : react_states.poly_switch, poly_num : react_states.poly_num, rhytnr_switch : react_states.rhytnr_switch, play_bars : react_states.play_bars, mute_bars : react_states.mute_bars, pracmod_switch : react_states.pracmod_switch, every : react_states.every, increase_by : react_states.increase_by, start_tempo : react_states.start_tempo, max_tempo : react_states.max_tempo, save_name: req.body.save_name, save_type: req.body.save_type }
                const collection = dbo.collection("PublicSaved")
                return collection.insertOne(data)
            })
            .then((result) => {
                client.close()
            })
            .catch((err) => {
                console.error("An error occurred:", err)
            })
    }
    res.sendFile(__dirname + "/save_react.html")
})

app.get("/save", function(req,res){
    res.sendFile(__dirname + "save_react.html")
})

app.get("/load_react.html", function(req, res) {
    res.sendFile(__dirname + "/load_react.html")
})

app.get("/search_react.html", function(req, res) {
    res.sendFile(__dirname + "/search_react.html")
})

let load_result = []

app.post("/load", function(req, res){
    console.log(req.body.load_name)
    MongoClient.connect(url)
        .then((connectedClient) => {
            client = connectedClient
            const dbo = client.db("Metronome")
            const regex = new RegExp(escapeRegExp(req.body.load_name), 'i')
            return dbo.collection("Saved").find({ save_name: { $regex: regex }, user_name: username }).toArray()	
        })
        .then((result) => {
            console.log(result)
            load_result = result
            client.close()
        })
        .catch((err) => {
            console.error("An error occurred:", err)
        })
    res.sendFile(__dirname + "/load_react.html")
})

app.get("/loadResult", function(req,res){
    console.log("going to load result")
    res.json({loaded_array : load_result})
})

app.post('/load_states', (req, res) => {
    const load_id = req.body.variable
    MongoClient.connect(url)
        .then((connectedClient) => {
            client = connectedClient
            const dbo = client.db("Metronome")
            return dbo.collection("Saved").find({ save_name : load_id }, { projection: { _id : 0, user_name : 1, tempo : 1, num : 1, note : 1, sub_div : 1, tone_arr : 1, cur_num : 1, poly_switch : 1, poly_num : 1, rhytnr_switch : 1, play_bars : 1, mute_bars : 1, pracmod_switch : 1, every : 1, increase_by : 1, start_tempo : 1, max_tempo : 1, user_name : 1, save_name : 1, save_type : 1 } }).toArray()	
        })
        .then((result) => {
            const load_res = result[0]
            react_states.tempo = load_res.tempo
            react_states.num = load_res.num
            react_states.note = load_res.note
            react_states.sub_div = load_res.sub_div
            react_states.tone_arr = load_res.tone_arr
            react_states.cur_num = load_res.cur_num
            react_states.poly_switch = load_res.poly_switch
            react_states.poly_num = load_res.poly_num
            react_states.rhytnr_switch = load_res.rhytnr_switch
            react_states.play_bars = load_res.play_bars
            react_states.mute_bars = load_res.mute_bars
            react_states.pracmod_switch = load_res.pracmod_switch
            react_states.every = load_res.every
            react_states.increase_by = load_res.increase_by
            react_states.start_tempo = load_res.start_tempo
            react_states.max_tempo = load_res.max_tempo
            client.close()
        })
        .catch((err) => {
            console.error("An error occurred:", err)
        })
    res.sendFile(__dirname + "/load_react.html")
})

app.post('/delete', (req, res) => {
    var load_id = req.body.variable;
    MongoClient.connect(url)
    .then((connectedClient) => {
        client = connectedClient
        const dbo = client.db("Metronome")
        const myquery = { save_name : load_id }
        return dbo.collection("Saved").deleteOne(myquery)
    })
    .then((result) => {
        client.close()
    })
    .catch((err) => {
        console.error("An error occurred:", err)
    })
    res.sendFile(__dirname + "/load_react.html")
})

app.get('/delete', function(req, res) {
    res.sendFile(__dirname + "/load_react.html")
})

app.post('/search_clicked', (req, res) => {
    var search_id = req.body.variable;
    MongoClient.connect(url)
    .then((connectedClient) => {
        client = connectedClient
        const dbo = client.db("Metronome")
        return dbo.collection("PublicSaved").find({ save_name : load_id }, { projection: { _id : 0, user_name : 1, tempo : 1, num : 1, note : 1, sub_div : 1, tone_arr : 1, cur_num : 1, poly_switch : 1, poly_num : 1, rhytnr_switch : 1, play_bars : 1, mute_bars : 1, pracmod_switch : 1, every : 1, increase_by : 1, start_tempo : 1, max_tempo : 1, user_name : 1, save_name : 1, save_type : 1 } }).toArray()	
    })
    .then((result) => {
        const search_res = result[0]
        MongoClient.connect(url)
            .then((connectedClient) => {
                client = connectedClient
                const dbo = client.db("Metronome")
                const data = { user_name : username , tempo : search_res.tempo , num : search_res.num, note : search_res.note, sub_div : search_res.sub_div, tone_arr : search_res.tone_arr, cur_num : search_res.cur_num, poly_switch : search_res.poly_switch, poly_num : search_res.poly_num, rhytnr_switch : search_res.rhytnr_switch, play_bars : search_res.play_bars, mute_bars : search_res.mute_bars, pracmod_switch : search_res.pracmod_switch, every : search_res.every, increase_by : search_res.increase_by, start_tempo : search_res.start_tempo, max_tempo : search_res.max_tempo, save_name: search_res.save_name, save_type: search_res.save_type }
                const collection = dbo.collection("Saved")
                return collection.insertOne(data)
            })
            .then((result) => {
                client.close()
            })
            .catch((err) => {
                console.error("An error occurred:", err)
            })
        client.close()
    })
    .catch((err) => {
        console.error("An error occurred:", err)
    })
    res.sendFile(__dirname + "/search_react.html")
})

let search_result = []

app.post("/search", function(req, res){
    console.log(req.body.search_name)
    MongoClient.connect(url)
        .then((connectedClient) => {
            client = connectedClient
            const dbo = client.db("Metronome")
            const regex = new RegExp(escapeRegExp(req.body.search_name), 'i')
            return dbo.collection("PublicSaved").find({ save_name: { $regex: regex } }).toArray()
        })
        .then((result) => {
            console.log(result)
            search_result = result
            client.close()
        })
        .catch((err) => {
            console.error("An error occurred:", err)
        })
    res.sendFile(__dirname + "/search_react.html")
})

app.get("/searchResult", function(req,res){
    console.log("going to search result")
    console.log(search_result)
    res.json({searched_array : search_result})
})


app.listen(8080)

