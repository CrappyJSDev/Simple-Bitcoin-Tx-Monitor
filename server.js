var bitcore = require('bitcore');
var p2p = require('bitcore-p2p');
var Peer = require('bitcore-p2p').Peer;
var messages = new p2p.Messages();
var prettyjson = require('prettyjson');
var config = require('./config');

// Connect to our local node or remote peer
var peer = new Peer({host: config.bitcoinConfig.Address, port: config.bitcoinConfig.p2port});  

// Called when a connection is established
peer.on('ready', function() {

  console.log("Connected to peer!");
  console.log("Bitcoin client Version: " + peer.version + "       ", "Bitcoin client Subversion: " + peer.subversion + "       ", "Bitcoin client Height: " + peer.bestHeight);

});

// Send a message requesting data
peer.on('inv', function(m) {

  peer.sendMessage(messages.GetData(m.inventory));

});

// When the node respondes with a txmessage we print it to console
peer.on('tx', function(m) {

  var txReceived = m.transaction.toObject();
  txHash = txReceived.hash;
  var outputs = [];
  var redText = false;
  var greenText = false;

  for (var i = 0; i< txReceived.outputs.length;i++){
    var satoshis = txReceived.outputs[i].satoshis;

    if (satoshis/100000000 > config.bitcoinConfig.alertAmount){
      redText = true;
    }

    var receivedAddress = new bitcore.Script(txReceived.outputs[i].script).toAddress();

    for (var o = 0; o < config.watchAddresses.length; o++){
      if(receivedAddress === config.watchAddresses[o]){
        greenText = true;
      }
    }

    outputs.push(["  Address: " + receivedAddress.toString() + "       " + satoshis/100000000 + " BTC"]);
  }

  var txObj = {
    "TxHash": txHash,
    "Outputs": outputs
  }

  if(redText){
    console.log("******************************************** TX RECEIVED *********************************************");
    console.log(prettyjson.render(txObj, {keysColor: 'red', dashColor: 'red', stringColor: 'red'}));
    console.log("*********************************************************************************************************");

  } else if (greenText){

    console.log("******************************************** TX RECEIVED *********************************************");
    console.log(prettyjson.render(txObj, {keysColor: 'green', dashColor: 'green', stringColor: 'green'}));
    console.log("*********************************************************************************************************");

  } else {

    console.log("******************************************** TX RECEIVED *********************************************");
    console.log(prettyjson.render(txObj, {keysColor: 'white', dashColor: 'white', stringColor: 'white'}));
    console.log("*********************************************************************************************************");
    
  }
  console.log("");
});

// When the node responds with a blockmessage we print it to console
peer.on('block', function(m) {

  var blockReceived = m.block.toObject();
  var blockHash = blockReceived.header.hash;
  var blockTime = blockReceived.header.time;
  var nonce = blockReceived.header.nonce;
  var blockTxs = blockReceived.transactions.length;

  console.log("******************************************** BLOCK RECEIVED *********************************************");
  console.log("Block Hash: " + blockHash, "    Block Time: " + blockTime, "      Block Nonce: " + nonce, "     Transactions in Block: " + blockTxs);
  console.log("*********************************************************************************************************")
});

peer.connect();
