const express = require('express')
const app = express()

app.use(express.json())

//This is the code to server our front-end from our server
app.use(express.static(`&{__dirname}/../public`))

//This is the Rollbar connection
// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'c31a6e6f6e90426297ddcfc64e472520',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/api/students', (req, res) => {
    //I want to get an info if students' names are sent. 
    rollbar.info('The students names were sent.')
    res.status(200).send(students)
});

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           //I want to get a rollbar info if new student name is added.
           rollbar.info(`A new student name was added: ${name}`)
           res.status(200).send(students)
       } else if (name === ''){
           //I want to get a warning when entered input is empty.
           rollbar.warning(`An Empty Input`)
           res.status(400).send('You must enter a name.')
       } else {
        //Another warning is someone tries to enter a name that already exists.
           res.status(400).send('That student already exists.')
           rollbar.warning('Someone entered an existing student name')
       }
   } catch (err) {
       console.log(err)
       //Get an error message to rollbar
       rollbar.error(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    let deletedName = students.splice(targetIndex, 1)
    //Get an info when a student name is deleted.
    rollbar.info(`The student name ${deletedName} was deleted.`)
    res.status(200).send(students)
})

const port = 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
