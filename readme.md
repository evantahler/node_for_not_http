# NODE FOR !(HTTP)

https://docs.google.com/presentation/d/1jijGOARfeMDSqZnl52uv3N9zL8K4Eiu4g6wGTtUIll4

## Install

### Drivers

This only is tested on OSX Yosemite

- You need the fdti driver: http://www.ftdichip.com/Drivers/D2XX.htm (access via normal FTDI)
  - (or `./node_modules/ftdi/instal.sh`)

- On OSX Mavericks / Yosemite, there is a compatibility with built-in FTTDI Drivers
  - `sudo kextunload -b com.apple.driver.AppleUSBFTDI`
  - http://support.synthe-fx.com/customer/portal/articles/1346688-important-lcompanion-10-9-mavericks-info

-- and to remove:
`cd /System/Library/Extensions && sudo rm -r FTDIUSBSerialDriver.kext`

### Config

Be sure to update your twitter API keys in `/config/servers/twitter.js`

## Run

`npm start`