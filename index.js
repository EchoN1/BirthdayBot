process.env.NTBA_FIX_319 = 1;
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

var token = '1083446992:AAEueReld0krcsouvmBVYAe8hLEimXGdeFM';

var bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
    fs.readFile('clients.txt',(err, data) => {
        if (!data.toString().match(JSON.stringify(msg.from))) {
            fs.appendFile('clients.txt', JSON.stringify(msg.from) + '\n', ()=>{});
        }
    });

    bot.sendMessage(msg.chat.id, '123', {
        "reply_markup": {
            "keyboard": [["Забрать фотки","Позвать бухать"]]
        }
    });
});

bot.onText(/Забрать фотки/, (msg) => {
    var fromId = msg.from.id;
    fs.readFile('photos.txt', (err, data) => {
        photos = data.toString().split('\n');
	    photos.pop();
        photos.forEach(elem => {
            bot.sendPhoto(fromId, elem, {});
        });        
    });    

});

bot.onText(/Позвать бухать/, (msg) => {
    var fromId = msg.from.id;
    var clients = fs.readFileSync('clients.txt', 'utf8').split('\n');
    var clientsArray = new Array();

    clients.pop();
    
    for (let i = 0; i < clients.length; i++) {
        clients[i] = JSON.parse(clients[i]);
        clientsArray.push([clients[i].username.toString()]);                
    }
    
    console.log(clientsArray);

    bot.sendMessage(fromId, 'Выберите с кем бухать', {
        "reply_markup": {
            'keyboard': clientsArray,
            'one_time_keyboard': true,
            'resize_keyboard': true,
            'force_reply': true
        }
    });
})


bot.onText(/Echo_N1/, (msg) => {

});

bot.on('photo', (photo) => {
    photo_id = photo.photo[0].file_id
    fs.appendFile('photos.txt', photo_id + '\n', () => {});
});

bot.on("polling_error", (err) => console.log(err));

