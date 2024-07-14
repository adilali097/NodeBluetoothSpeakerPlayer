const readline = require('readline');
const bluetooth = require('node-bluetooth');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const device = new bluetooth.DeviceINQ();

function connectToDevice(address) {
  const btSerial = new bluetooth.BluetoothSerialPort();

  btSerial.findSerialPortChannel(address, function(channel) {
    btSerial.connect(address, channel, function() {
      console.log('Connected to Bluetooth speaker:', address);
      rl.question('Enter path to audio file to play: ', (filePath) => {
        playAudio(filePath.trim(), btSerial);
      });
    }, function(err) {
      console.error('Error connecting:', err);
      rl.close();
    });
  }, function(err) {
    console.error('Error finding channel:', err);
    rl.close();
  });
}

function playAudio(filePath, btSerial) {
  btSerial.write(fs.readFileSync(filePath), function(err, bytesWritten) {
    if (err) {
      console.error('Error writing:', err);
    } else {
      console.log('Sent', bytesWritten, 'bytes');
      rl.close();
    }
  });
}

function discoverAndConnect() {
  rl.question('Enter the name of your Bluetooth speaker: ', (speakerName) => {
    console.log(`Searching for ${speakerName}...`);
    device
      .on('finished', () => {
        console.log('Finished scanning.');
        rl.close();
      })
      .on('found', (address, name) => {
        console.log(`Found device: ${name} [${address}]`);
        if (name === speakerName) {
          device.stop();
          connectToDevice(address);
        }
      })
      .scan();
  });
}

// Start the discovery process
discoverAndConnect();

rl.on('close', () => {
  console.log('Exiting...');
  process.exit(0);
});
