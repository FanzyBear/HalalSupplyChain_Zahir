## Modified Hardhat Boilerplate
This repo contains CSCI 4312 Blockchain Project from group ZAHIR

## Quick Start
Make sure your machine have Docker Desktop installed then clone this repository and build the docker image
```
git clone https://github.com/FanzyBear/HalalSupplyChain_Zahir
docker compose build
docker compose up
```
In a separate terminal window, deploy the smart contract to the local hardhat network. You dont need to start the hardhat network since its automaticly start when the docker ran.
```
$docker compose exec hardhat bash
npx hardhat run scripts/deploy.js --network localhost
```
Now go to http://localhost:3000 in your browser. Open the Metamask (extension) and add localhost:8545 as a Network with chain id 31337. The other parameter is optional (up to you what you want to put).

Then Connect the Wallet to local host and Play around witho our Halal Supply Chain Dapps.

## Zahir Features

- Role-Based Access Control
- Batch Creation (Farmer Only)
- Full Supply Chain Tracking
- Slaughterer + Halal Certification
- Consumer-Facing Transparent Tracking
- QR Code 
- Security
- User Experience Features

### Why Docker?
Because of the "it works on my machine" bs. Now the whole dapps in one box that just works the same everywhere.


