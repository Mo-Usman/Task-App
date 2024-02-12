const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, sum } = require('../src/math')

test('Should return total with tip', () => {
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
})

test('Should return total with default tip', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})

test('Should return 0', () => {
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})

test('Should return 32', () => {
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

// test('Async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)
// })

test('Should add two numbers', (done) => {
    sum(2, 3).then((result) => {
        expect(result).toBe(5)
        done()
    })
})

test('Should add two numbers async/await', async () => {
    const result = await sum(10, 12)
    expect(result).toBe(22)
})