//tugas buat api testing 
//validasi data yang dikirim untuk POST PUT / PATCH


const request = require('supertest')('https://dummyjson.com')
const chai = require('chai')
const schema = require('chai-json-schema')
const {expect} = require('chai');

chai.use(schema)

const skematodo =  { 
	type:'object',
	properties : {
		todos:{
			type:'array',
			items : {
				type: 'object',
				properties : {
					id:{type: 'number'},
					todo:{type:'string'},
					completed:{type:'boolean'},
					userId:{type:'number'}
	},
	required: ['id', 'userId']
}
}
	}
}

describe("testing API todos", async function() {
it('Test get semua data api todos', async  () => {

	const res = await request.get('/todos')
	expect(res.body).have.jsonSchema(skematodo)
})

it('Test get 1 data api todos', async () =>{
	const res = await request.get('/todos/30')
	expect(res.body).have.jsonSchema(skematodo);
})

it('Test get random data api todos', async () => {
	const res = await request.get('/todos/random')
	expect(res.body).have.jsonSchema(skematodo);
})

it('Test get all todos based on userId', async () => {
	const res = await request.get('/todos/user/14')
	expect(res.body).have.jsonSchema(skematodo);
})

it ('Test post data ke todos', async () => {
	const data = {
		todo: 'Create a new account',
		completed : 'false',
		userId : 52
	}
	const res = await request.post('/todos/add').send(data)
	expect(res.statusCode).to.equal(200)
	expect(res._body.userId).to.deep.equal(data.userId)
})

it('Test post data salah ke todos', async () => {
	const data = {
		todo: 'Gagals',
		completed :'brrrr',
		userId : 'lima dua'
	}
	const res = await request.post('/todos/add').send(data)
	expect(res.statusCode).to.not.equal(200)
	expect(res._body.userId).to.not.equal(data.userId)
})

it('Berhasil mengupdate data ke todos', async () => {
	const data = {
		todo: 'Deleted',
		completed :'true'
	}
	const res = await request.put('/todos/3').send(data)
	expect(res.statusCode).to.equal(200)
	expect(res._body.completed).to.deep.equal(data.completed)
})

it('Gagal mengupdate data ke todos', async () => {
	const data = {
		todo: 'Deleted',
		completed :'34912780492374',
		userId :'empat'
	}
	const res = await request.put('/todos/3').send(data)
	expect(res.statusCode).to.not.equal(200)
	expect(res._body.userId).to.not.equal(data.userId)
})

it ('Berhasil menghapus data didalam todos', async() => {
	const res = await request.delete('/todos/3')
	expect(res.statusCode).to.equal(200)
	expect(res._body.isDeleted).to.equal(true)
})

it('mengambil data todos yang dilimit', async() => {
	const res = await request.get('/todos?limit=2&skip=10')
	expect(res.statusCode).to.equal(200)
	expect(res._body).to.have.jsonSchema(skematodo)
})
})