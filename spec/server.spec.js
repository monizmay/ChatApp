var request = require('request')

describe('calc', () => {
    it('should be 4', () => {
        expect(2*2).toBe(4)
    })
})

describe('get Message', () => {
    it('Should return 200 Ok', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(res.statusCode).toEqual(200)
            done()
        })
    })
})