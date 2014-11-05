# LIGHTS

## Install

- You need the fdti driver: http://www.ftdichip.com/Drivers/D2XX.htm (access via normal FTDI)
  - (or `./node_modules/ftdi/instal.sh`)

- On Mavericks, there is some comaptibility issue or something 
  - `sudo kextunload -b com.apple.driver.AppleUSBFTDI`
  - http://support.synthe-fx.com/customer/portal/articles/1346688-important-lcompanion-10-9-mavericks-info

## Alternatives
- You probably also want to re-install the normal FTDI driver: http://www.ftdichip.com/Drivers/VCP.htm (access via /dev/DEVICE)

-- and to remove:
`cd /System/Library/Extensions && sudo rm -r FTDIUSBSerialDriver.kext`
