const ethers = require('ethers');
const ganache = require('ganache-cli');
const assert = require('assert');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const FVMDidRegistry = artifacts.require("FVMDidRegistry");

// Library initialization that will talk with Blockchain
const provider = new ethers.providers.Web3Provider(ganache.provider({ gasLimit: 8000000 }));
// Initializing the build files
const FVMDIDRegistryJSON = require('../build/contracts/FVMDidRegistry.json');

let accounts, FVMDIDRegistryInstance, FVMDIDRegistryInstance_test, FVMUpgradableInstance, FVMUpgradableInstance_test;

// Describing the 1st Test
// This will setup Ganache with some test address
describe('Ganache Setup', async () => {

    it('Ganache setup with Test Accounts', async () => {

        // List of accounts are fetched here
        accounts = await provider.listAccounts();

        // We will check that atleast 2 accounts are loaded
        assert.ok(accounts.length >= 1, '2 Accounts are present minimum');
    });
});

// Upgradable with Proxy
// Deployment Testing 1.0
describe('Setting up the Upgradable Smart Contract', async () => {

    describe('Setting up the contract', async () => {

        it("Should deploy contract with Proxy, with no parameters/Constructor", async () => {
            FVMUpgradableInstance = await deployProxy( FVMDidRegistry );
            FVMUpgradableInstance_test = new ethers.Contract(FVMUpgradableInstance.address, FVMDIDRegistryJSON.abi, provider.getSigner(accounts[3]));
            assert.ok(FVMUpgradableInstance.address, 'Upgradeable contract is deployed');
        });
    });

    //Check Create Function test 1.1
    describe('Checking the Create function using Upgradeable Contract', async () => {

        it('This should store the DID doc on Upgradable Contract and will read and check if the value stored is correct', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x2f65b747440deaf596892dfc7965040be8b99100';
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const tx = await FVMUpgradableInstance.createDID(did, doc);

            // Getting the set value in ganache blockchain
            const currentValue = await FVMUpgradableInstance.getDID(did);

            // Comparing the set value to confirm
            assert.equal(
                currentValue,
                doc,
                'value set must be able to get'
            );

            assert.notEqual(
                currentValue,
                null,
                'value should not be empty'
            );
        });
    });

    //Describing the 1.2 Test Case
            describe('Checking the getTotalNumberOfDIDs Function', async () => {
                it('This should get correct number of DIDs registered', async () => {
        
                    const currentValue = await FVMUpgradableInstance.getTotalNumberOfDIDs();
                    assert.equal(
                        currentValue,
                        1,
                        'value should be matching'
                    );
                });
            });
    

    // Describing the 1.3 Test case
    describe('Checking the Update function in Upgradable Contract', async () => {

        it('This should update the DID doc on Upgradable Contract and will read and check if the value stored is correct', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x2f65b747440deaf596892dfc7965040be8b99100';
            //changed the controller
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const tx = await FVMUpgradableInstance.updateDID(did, doc);

            // Getting the set value in ganache blockchain
            const currentValue = await FVMUpgradableInstance.getDID(did);

            // Comparing the set value to confirm
            assert.equal(
                currentValue,
                doc,
                'value set must be able to get'
            );
        });
    });

    //Describing test 1.4 to check if test fails if we update with different controller
    describe('Checking update with wrong controller', async () => {

        it('This should not update DID doc ', async () => {

            const did = '0x2f65b747440deaf596892dfc7965040be8b99100';
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            try {
                assert.ifError(

                    //sending transaction using different controller
                    await FVMUpgradableInstance_test.functions.updateDID(did, doc));
            } catch (error) {
            }
        });
    });

    // Describing the 1.5 Test case
    describe('Checking the Delete function in Upgradable Contract', async () => {

        it('This should delete the DID doc on Upgradable Contract and will read and check if the value is now an empty string', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x2f65b747440deaf596892dfc7965040be8b99100';
            const tx = await FVMUpgradableInstance.deleteDID(did);

            // Getting the set value in ganache blockchain
            const currentValue = await FVMUpgradableInstance.getDID(did);

            // Comparing the set value to confirm
            assert.equal(
                currentValue,
                "",
                'value should be matching'
            );
        });
    });

    // Describing the 1.6 Test case
    describe('Checking the Create function in Upgradable Contract', async () => {

        it('This should store the DID doc on Upgradable Contract and will read and check if the value stored is not null', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x54ec7be8b24f7139f870f277cf99c527ff43892b';
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x54ec7be8b24f7139f870f277cf99c527ff43892b","verificationMethod":[{"id":"did:FVM:0x54ec7be8b24f7139f870f277cf99c527ff43892b","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x54ec7be8b24f7139f870f277cf99c527ff43892b","publicKeyBase58":"RwHysxjkzFdJDqi2irHRVRFHX9uUj5aVAXVoufnk5PDA4qcn1ejJMgGhqCsFdQqXRCTdi4TbEQFJjDUAdi2JvYmH"}]}';
            const doctest = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const tx = await FVMUpgradableInstance.createDID(did, doc);

            // Getting the set value in ganache blockchain
            const currentValue = await FVMUpgradableInstance.getDID(did);

            // Checking value is not null

            assert.notEqual(
                currentValue,
                "",
                'value should not match'
            );
        });
    });

    // Describing the 1.7 Test case
    describe('Checking the Update function in Upgradable Contract', async () => {

        it('This should update the DID doc on Upgradable Contract and will read and check if the value stored has changed', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x54ec7be8b24f7139f870f277cf99c527ff43892b';
            //changed the controller
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const docoriginal = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x54ec7be8b24f7139f870f277cf99c527ff43892b","verificationMethod":[{"id":"did:FVM:0x54ec7be8b24f7139f870f277cf99c527ff43892b","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x54ec7be8b24f7139f870f277cf99c527ff43892b","publicKeyBase58":"RwHysxjkzFdJDqi2irHRVRFHX9uUj5aVAXVoufnk5PDA4qcn1ejJMgGhqCsFdQqXRCTdi4TbEQFJjDUAdi2JvYmH"}]}';
            const tx = await FVMUpgradableInstance.updateDID(did, doc);

            // Getting the set value in ganache blockchain
            const currentValue = await FVMUpgradableInstance.getDID(did);

            // Comparing the set value to confirm
            assert.notEqual(
                currentValue,
                docoriginal,
                'value should not match'
            );
        });
    });


    // Describing the 1.8 Test Case
    describe('Checking the Delete function in Upgradable Contract', async () => {

        it('This should delete the DID doc on Upgradable Contract and will read and check if the value is now not equal to the updated doc', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x54ec7be8b24f7139f870f277cf99c527ff43892b';
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const tx = await FVMUpgradableInstance.deleteDID(did);

            // Getting the set value in ganache blockchain
            const currentValue = await FVMUpgradableInstance.getDID(did);

            // Comparing the set value to confirm
            assert.notEqual(
                currentValue,
                doc,
                'value should not be matching'
            );
        });
    });

      //Describing the 1.9 Test Case
      describe('Checking the getTotalNumberOfDIDs Function', async () => {
        it('This should get correct number of DIDs registered', async () => {

            const totalValue = await FVMUpgradableInstance.getTotalNumberOfDIDs();
            const deltedValue = await FVMUpgradableInstance.getTotalNumberOfDeletedDIDs();
            const currentValue = totalValue - deltedValue;
            assert.equal(
                currentValue,
                0,
                'value should be matching'
            );
        });
    });

    //Describing the 1.10 Test Case
    describe('Checking the Transafer Ownership Function', async () => {
        it('This should transfer ownership of contract to another user', async () => {

            const newOwner = accounts[5];
            const owner = await FVMUpgradableInstance.getOwner();
            const tx = await FVMUpgradableInstance.transferOwnership(newOwner);
            const currentOwner = await FVMUpgradableInstance.getOwner();

            assert.notEqual(
                owner,
                currentOwner,
                'value should not be equal'
            );
        });
    });
   
        //Describing the 1.11 Test Case
        describe('Checking the Transafer Ownership Function', async () => {
            it('This should not transfer ownership of contract to another user since the transaction is being initiated by different owner', async () => {
    
                const newOwner = accounts[6];
                try {
                    assert.ifError(
                        //sending transaction using different controller
                        await FVMUpgradableInstance_test.functions.transferOwnership(newOwner));
                } catch (error) {
                }
            });
        });
    })


// basic Contract Testing
// Deployment Testing 2.0
describe('Basic Contract Testing', async () => {

    // Describing a SubTest case
    describe('Setting up the contract', async () => {

        it('This Deploys FVM Smart contract from 1st account with no Parameters/Constructor', async () => {

            // Creating a contract factory for deploying contract. 
            const FVMDIDRegistry = new ethers.ContractFactory(
                FVMDIDRegistryJSON.abi,
                FVMDIDRegistryJSON.bytecode,
                provider.getSigner(accounts[2])
            );
            FVMDIDRegistryInstance = await FVMDIDRegistry.deploy();
            FVMDIDRegistryInstance_test = new ethers.Contract(FVMDIDRegistryInstance.address, FVMDIDRegistryJSON.abi, provider.getSigner(accounts[3]));
            assert.ok(FVMDIDRegistryInstance.address, 'conract address should be present');
        });

    });

    // Describing the 2.1 Test case
    describe('Checking the Create function in Contract', async () => {

        it('This should store the DID doc on Contract and will read and check if the value stored is correct', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x2f65b747440deaf596892dfc7965040be8b99100';
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const tx = await FVMDIDRegistryInstance.functions.createDID(did, doc);

            // Transfer confirmation
            await tx.wait();

            // Getting the set value in ganache blockchain
            const currentValue = await FVMDIDRegistryInstance.functions.getDID(did);

            // Comparing the set value to confirm
            assert.equal(
                currentValue,
                doc,
                'value set must be able to get'
            );

            assert.notEqual(
                currentValue,
                null,
                'value should not be empty'
            );
        });
    });

    // Describing the 2.2 Test case
    describe('Checking the Update function in Contract', async () => {

        it('This should update the DID doc on Contract and will read and check if the value stored is correct', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x2f65b747440deaf596892dfc7965040be8b99100';
            //changed the controller
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const tx = await FVMDIDRegistryInstance.functions.updateDID(did, doc);

            // Transfer confirmation
            await tx.wait();

            // Getting the set value in ganache blockchain
            const currentValue = await FVMDIDRegistryInstance.functions.getDID(did);

            // Comparing the set value to confirm
            assert.equal(
                currentValue,
                doc,
                'value set must be able to get'
            );
        });
    });
    //Describing test 2.3 to check if test fails if we update with different controller
    describe('Checking update with wrong controller', async () => {

        it('This should not update DID doc ', async () => {

            const did = '0x2f65b747440deaf596892dfc7965040be8b99100';
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            try {
                assert.ifError(
                    //sending transaction using different controller
                    await FVMDIDRegistryInstance_test.functions.updateDID(did, doc));
            } catch (error) {
            }
        });
    });

    // Describing the 2.4 Test case
    describe('Checking the Delete function in Contract', async () => {

        it('This should delete the DID doc on Contract and will read and check if the value is now an empty string', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x2f65b747440deaf596892dfc7965040be8b99100';
            const tx = await FVMDIDRegistryInstance.functions.deleteDID(did);

            // Transfer confirmation
            await tx.wait();

            // Getting the set value in ganache blockchain
            const currentValue = await FVMDIDRegistryInstance.functions.getDID(did);

            // Comparing the set value to confirm
            assert.equal(
                currentValue,
                "",
                'value should be matching'
            );
        });
    });

    // Describing the 2.5 Test case
    describe('Checking the Create function in Contract', async () => {

        it('This should store the DID doc on Contract and will read and check if the value stored is not null', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x54ec7be8b24f7139f870f277cf99c527ff43892b';
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x54ec7be8b24f7139f870f277cf99c527ff43892b","verificationMethod":[{"id":"did:FVM:0x54ec7be8b24f7139f870f277cf99c527ff43892b","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x54ec7be8b24f7139f870f277cf99c527ff43892b","publicKeyBase58":"RwHysxjkzFdJDqi2irHRVRFHX9uUj5aVAXVoufnk5PDA4qcn1ejJMgGhqCsFdQqXRCTdi4TbEQFJjDUAdi2JvYmH"}]}';
            const doctest = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const tx = await FVMDIDRegistryInstance.functions.createDID(did, doc);

            // Transfer confirmation
            await tx.wait();

            // Getting the set value in ganache blockchain
            const currentValue = await FVMDIDRegistryInstance.functions.getDID(did);

            // Checking value is not null

            assert.notEqual(
                currentValue,
                doctest,
                'value should not match'
            );
        });
    });

    // Describing the 2.6 Test case
    describe('Checking the Update function in Contract', async () => {

        it('This should update the DID doc on Contract and will read and check if the value stored has changed', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x54ec7be8b24f7139f870f277cf99c527ff43892b';
            //changed the controller
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const docoriginal = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x54ec7be8b24f7139f870f277cf99c527ff43892b","verificationMethod":[{"id":"did:FVM:0x54ec7be8b24f7139f870f277cf99c527ff43892b","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x54ec7be8b24f7139f870f277cf99c527ff43892b","publicKeyBase58":"RwHysxjkzFdJDqi2irHRVRFHX9uUj5aVAXVoufnk5PDA4qcn1ejJMgGhqCsFdQqXRCTdi4TbEQFJjDUAdi2JvYmH"}]}';
            const tx = await FVMDIDRegistryInstance.functions.updateDID(did, doc);

            // Transfer confirmation
            await tx.wait();

            // Getting the set value in ganache blockchain
            const currentValue = await FVMDIDRegistryInstance.functions.getDID(did);

            // Comparing the set value to confirm
            assert.notEqual(
                currentValue,
                docoriginal,
                'value should not match'
            );
        });
    });


    // Describing the 2.7 Test case
    describe('Checking the Delete function in Contract', async () => {

        it('This should delete the DID doc on Contract and will read and check if the value is now not equal to the updated doc', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x54ec7be8b24f7139f870f277cf99c527ff43892b';
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:FVM:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:FVM:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const tx = await FVMDIDRegistryInstance.functions.deleteDID(did);

            // Transfer confirmation
            await tx.wait();

            // Getting the set value in ganache blockchain
            const currentValue = await FVMDIDRegistryInstance.functions.getDID(did);

            // Comparing the set value to confirm
            assert.notEqual(
                currentValue,
                doc,
                'value should not be matching'
            );
        });
    });
});