const cryptoHash = require('./crypto-hash');


describe('cryptoHash()', () => {
    it('generates a SHA-256 hashed output for ´foo´', () => {
        expect(cryptoHash('foo')).toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b')
    });

    it('generates a SHA-256 hashed output for ˙bar˙', () => {
        expect(cryptoHash('bar')).toEqual('4c293ff010a730f0972761331d1b5678478d425c2dc5cefd16d8f20059e497f3')
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
    })

    it('produces a unique hash when the properties have changed on an input', () => {
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] = 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});