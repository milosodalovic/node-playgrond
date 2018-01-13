console.log('starging app');

setTimeout(()=>{
    console.log('inside callback');
}, 2000)

setTimeout(()=>{
    console.log('2nd timeout with zero delay');
}, 0)

console.log('finishing up');