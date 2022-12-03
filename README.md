# FVM DID Registry Contract

This library is an implementation of a registry contract that supports the FVM DID Method.

## Overview

The FVM registry contract acts as a public ledger, where the FVM-Identity specified Decentralised Identifiers will be logged. The specifications related to FVM DID method are mentioned in the      document. A DID generated using the FVM DID generator, can be stored and managed on the ledger using this contract library.

## Contract Deployment

| Network | ChainId | Registry Address |
| :---: | :---: | :---: | 
| FVM Testnet (Wallaby)  | 31415 | 0xD3c51785968E4Cdb55726c85194eB97105b99b80 |

## Methods

* ```createDID(address, string)``` : The method createDID is used to create and log a new DID on the FVM chain. The parameter of address type, will act as the reference key, to refer  the did document stored on the chain. The string type variable will contain the did document, that will be stored on the fvm chain.

* ```updateDIDDoc(address, string)``` : The method updateDID is included in contract, which will facilitate the controller, and only the controller of the did, to update the document if need arises. Though the FVM DID method, defines how the DID doc is defined as per standards, and that can be resolved.  

* ```deleteDIDDoc(address)``` : The method deleteDID is included in the  contract, that only the controller of DID can access, to delete a particular DID from ledger.

* ```getDIDDoc(address)``` : The method getDID helps to resolve the DID document.

* ```transferOwnership(address)``` : The method transferOwnership, helps in transferring the ownership of contract to a new owner. Only the current owner can access this function.

* ```getOwner()``` : the method getOwner helps one to fetch the current owner of the contract.

* ```getTotalNumberOfDIDs()``` : the method getTotalNumberOfDIDs helps one to fetch the total number of DIDs ever written on FVM Ledger, with the number of currently active DIDs.

* ```getTotalNumberOfDeletedDIDs()```: the method getTotalNumberOfDeletedDIDs helps one fetch the total number of DIDs deleted from FVM Ledger.

* ```getDIDDOcByIndex(uint256)``` : The method getDIDDOcByIndex helps,to resolve DID document by index.

## Example ethers code

Using ethers, the following illustrates how one can interact with FVMRegistry contract, from client side application.

## Loading the Contract

```
const ethers = require('ethers');
const url = https://rpc-mumbai.fvm.today; // For fvm testnet
const DID_ADDRESS = `<Contract Address>`;
const provider = new ethers.providers.JsonRpcProvider(url);

let wallet = new ethers.Wallet(`<Signer Key/Private Key>`, provider);
let registry = new ethers.Contract(DID_ADDRESS, <Contract ABI>, wallet);
```

## Creating a DID

```
let returnHashValues = await registry.functions.createDID(<DID address>, DidDoc);
```

## Updating a DID


```
let returnHashValues = await registry.functions.updateDIDDoc(<DID address>, DidDoc)
```

## Delete a DID

```
let returnHashValues = await registry.functions.deleteDIDDoc(<DID address>)
```

## Resolving a DID 

```
let returnDidDoc = await registry.functions.getDIDDoc(<DID address>);
```

# Deploying the Contract on fvm network

Pre-requisites

* NodeJS 

```
https://nodejs.org/en/download/
```

* Truffle

```
https://www.trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask
```

* Ganache

```
https://www.trufflesuite.com/ganache
```

* A wallet connected to FVM network, with fvm token in it. One can receive the fvm Test Tokens from their faucet.

 
## Deployment

Clone the above repository

```
git clone https://gitlab.com/FVM-did/FVM-did-smart-contract.git
```

Install Dependencies

```
npm i
```

Run a ganache instance (only required for Local Deployment) 

```
ganache-cli
```

Update your and RPC URL in .env file.

```
RPCURL="<Place your RPC URL here>"
SIGNER="<Place your mnemonic/Private Key here>"
```

On a new console window run

```
truffle migrate --network <network name>
```

## Testing

For Testing use the command

```
truffle test
```
The test cases run on a ganache setup.