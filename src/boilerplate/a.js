console.log(`start`)

setTimeout(function()  {
    console.log(`end of timeout`)
},0);

Promise.resolve("result of promise")
.then(value => console.log(value));