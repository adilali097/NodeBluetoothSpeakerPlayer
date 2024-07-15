const usbDetect = require('usb-detection');
const open = require('open');

// Start monitoring for USB events
usbDetect.startMonitoring();

// Add a listener for when a USB device is inserted
usbDetect.on('add', (device) => {
  console.log('USB device connected:', device);
  // Open the browser to google.com
  open('https://www.google.com');
});

console.log('Listening for USB connections...');
