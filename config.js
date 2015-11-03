// Bitcoin configuration options

exports.bitcoinConfig = {
  Address: "127.0.0.1", // default to localhost
  p2port: 8333, //standard bitcoin p2p port
  alertAmount: 1 // if any transactions are over this amount the logging will be red
}

exports.watchAddresses = ["1NxaBCFQwejSZbQfWcYNwgqML5wWoE3rK4"]; // if any output addresses match this array the logging will be green