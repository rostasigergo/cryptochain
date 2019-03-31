const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-e42ad733-b2bb-4c25-97fa-8d8550b31c72',
    subscribeKey: 'sub-c-6bdd332e-53c6-11e9-94f2-3600c194fb1c',
    secretKey: 'sec-c-ZjU0NzNlMGMtMWZjMy00NWU4LTg0NGMtMDNkZDE0MzhhYWMx'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;

        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({channels: Object.values(CHANNELS)});

        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}`);

                const parsedMessage = JSON.parse(message);

                if (channel === CHANNELS.BLOCKCHAIN) {
                    this.blockchain.replaceChain(parsedMessage);
                }
            }
        };
    }

    publish({ channel, message }) {
        this.pubnub.publish({channel, message});
        // this.pubnub.unsubscribe(channel, () => {
        //     this.pubnub.publish({channel, message}, () => {
        //         this.pubnub.subscribe(channel);
        //     });
        // });        
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;