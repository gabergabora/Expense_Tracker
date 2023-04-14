const randomIntFromInterval =  () => { // min and max included 
    const max = 100000;
    const min = 1;
    return Math.floor(Math.random() * (max - min + 1) + min)
}


module.exports = { randomIntFromInterval }