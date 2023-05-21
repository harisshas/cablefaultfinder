const express=require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const port=3000;

var latestmessage="no messages recieved as of now";
var latestmessagetime="";

var client=mqtt.connect("mqtt://broker.hivemq.com:1883",{clientId:"mqttlistener"});
var options={retain:true, qos:0};
var topic="cablefaultdata";

client.subscribe(topic, {qos:0});

client.on("connect",function()
{
    console.log("connected to mqtt "+client.connected);
});

client.on("error",function(error)
{
    console.log("can't connect to mqtt "+error);
    process.exit(1);
});

client.on("message",function(topic, message, packet)
{
    console.log("recieved message :"+message);
    console.log("recieved topic :"+topic);
    console.log("recieved packet :"+packet);
    
    latestmessage=message;

    let date_ob_str = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    let date_ob = new Date(date_ob_str);
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    console.log("present time: "+date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds);
    latestmessagetime=date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
});

app.get('/',(req,res) =>{
   console.log('get request recevied');
   res.send(""+String(latestmessage)+" <br/>"+"last recieved: "+latestmessagetime);
})

app.listen(port, () =>{
   console.log('server started and listening on port '+port);
})

