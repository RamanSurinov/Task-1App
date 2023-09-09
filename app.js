const express = require('express')
const app = express()

const port = 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const users = [
   { id: 1, name: "John", isMan: true, age: 25 },
   { id: 2, name: "Bob", isMan: true, age: 26 },
   { id: 3, name: "Bread", isMan: true, age: 27 },
]

let id = users.reduce((sum, i) => i.id + sum, 0)
console.log(id)


app.get('/users', (req, res) => {
   res.send(users)
})
app.post('/user', (req, res) => {
   let { name, isMan, age } = req.body
   users.push({
      id: ++id,
      name,
      isMan: isMan === 'true' ? true : false,
      age: Number(age)
   })
   res.status(201)
   res.send(req.body)
})
app.put('/user/:id', (req, res) => {
   const user = users.find(i => i.id == req.params.id)
   console.log(user.id)
   if (user.id) {
      let { name, isMan, age } = req.body
      users.splice(users.findIndex(i => i.id == req.params.id), 1, {
         id: user.id,
         name,
         isMan,
         age,
      })
      res.status(200)
      res.send(users)
   }
   res.status(404)
   res.send('user not found')
})

app.patch('/user/:id', (req, res) => {
   let { name, isMan, age } = req.body
   users.map(i => {
      if (i.id == req.params.id) {
         i.name = name ?? i.name
         i.isMan = isMan ?? i.isMan
         i.age = age ?? i.age
      }
   })
   res.send(users)
})

app.delete('/user/:id', (req, res) => {
   users.splice(users.findIndex(i => i.id == req.params.id), 1)
   res.send(users)
})

app.get('/users/:gender', (req, res) => {
   let { gender } = req.params
   console.log(gender == 'F')
   console.log(users)

   if (gender == 'M') {
      res.send(users.filter(i => i.isMan === true))
   } else if (gender === 'F') {
      res.send(users.filter(i => i.isMan === false))
   } else {
      res.status(404)
      res.send('gender == M || F')
   }

})

app.get('/filtredUsers', (req, res) => {
   let { min, max } = req.query
   res.send(users.filter(i => i.age > min && i.age < max))
})


app.listen(port, () => console.log(`server start ${port}`))

