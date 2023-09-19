const request = require('supertest')('https://dummyjson.com')

async function test(){
const res = await request.get('/todos');
console.log(res.body)

}

test();