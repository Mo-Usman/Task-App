const calculateTip = (total, tipPercent = .25) => total + (total * tipPercent)

const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

const sum = (a, b) => {
    return new Promise((resolve, reject) => {
        return setTimeout(() => {
            if(a < 0 || b < 0) {
                return reject('Numbers must be greater than 0')
            }
            resolve(a + b)
        }, 2000)
    })
}

module.exports = {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    sum
}