const Block = require('./block');
const { cryptoHash } = require('../util');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({data}) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        })

        this.chain.push(newBlock);
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.error('The incoming chain must be longer');
            return;
        }

        if (!Blockchain.isValidChain(newChain)) {
            console.error('The incoming chain must be valid');
            return;
        }
        
        console.log('replacing chain with', newChain);
        this.chain = newChain;
    } 

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let i = 1; i < chain.length; i++) {
            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
            const actualLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;

            if (lastHash !== actualLastHash) 
                return false;

            if (Math.abs(lastDifficulty - difficulty) > 1) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, nonce, difficulty, data);

            if (hash !== validatedHash) 
                return false;
        }

        return true;
    }
}


module.exports = Blockchain;