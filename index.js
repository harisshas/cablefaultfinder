const express=require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const port=3000;

var latestmessage="no messages recieved as of now";

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
});

app.get('/',(req,res) =>{
   console.log('get request recevied');
   res.send(" "+String(latestmessage));
})

app.listen(port, () =>{
   console.log('server started and listening on port '+port);
})

