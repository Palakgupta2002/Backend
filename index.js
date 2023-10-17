const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
var emaill
const server = express()

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test')
  console.log('Connected to MongoDB')
}

// Define schema first
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  college: String,
  email: String,
  phone: String,
  image: [
    {
      description: String, // Add a description property for the image
      data: Buffer,
      contentType: String,
      selectedOption: String,
    },
  ],
})

// Create model using schema
const User = mongoose.model('user', userSchema)
const BlogSchema = new mongoose.Schema({
  Blogemail: String,
  Blogimage: {
    Bdata: Buffer,
    BcontentType: String,
    contentType: String,
  },
  BlogDes: String,
  Blogtitle: String,
  Blogdate: String,
})
const Blog = mongoose.model('Blog', BlogSchema)

//This is for to connect a two localhost to each other like gateway
server.use(cors())
server.use(bodyParser.json())
server.get('/', (res, req) => {
  req.send('hello')
})
const upload = multer()

//This is for Signup
server.post('/Signup', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email })

    if (existingUser) {
      console.log('User exists')
      return res.status(400).json({ error: 'Email already exists' })
    }

    const newUser = new User()
    newUser.username = req.body.username
    newUser.password = req.body.password
    newUser.college = req.body.college
    newUser.email = req.body.email
    newUser.phone = req.body.phone

    // Save the new user to the database
    const doc = await newUser.save()

    // Return a success response
    console.log('Successfully registered')
    return res.status(200).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error('Error inserting user data:', error)
    return res.status(500).json({ error: 'An error occurred' })
  }
})
//Schema for quiz Creation
const QuizSchema = mongoose.Schema({
  Question: String,
  Option1: String,
  Option2: String,
  Option3: String,
  Option4: String,
  Qemail: String,
  QAnswer: String,
})
//Create a quiz
const Quiz = mongoose.model('Quiz', QuizSchema)
server.post('/CreateQuiz', async (req, res) => {
  console.log(req.body)
  try {
    const NewRoprt = new Quiz()
    NewQuiz.Question = req.body.Question // Use "Question" instead of "Questions"
    NewQuiz.Option1 = req.body.Option1
    NewQuiz.Option2 = req.body.Option2
    NewQuiz.Option3 = req.body.Option3
    NewQuiz.Option4 = req.body.Option4
    NewQuiz.Qemail = req.body.Qemail
    NewQuiz.QAnswer = req.body.Answer // Use "Qemail" instead of "QEmail"

    await NewQuiz.save()
    res.status(200).json({ message: 'Quiz created successfully' })
  } catch (error) {
    console.error('Error creating quiz:', error)
    res.status(500).json({ message: 'Error creating quiz' })
  }
})

// Define the endpoint for creating a blog
server.post('/BlogCreation', upload.single('Blogimage'), async (req, res) => {
  try {
    const blogCreate = new Blog()
    blogCreate.Blogemail = req.body.BlogEmail // Match the field name from the frontend
    blogCreate.BlogDes = req.body.BlogDescription
    blogCreate.Blogdate = req.body.BlogDate
    blogCreate.Blogtitle = req.body.Blogtitle // Match the field name from the frontend

    if (req.file) {
      blogCreate.Blogimage = {
        Bdata: req.file.buffer,
        BcontentType: req.file.mimetype,
      }
    }

    await blogCreate.save()
    res
      .status(200)
      .json({ message: 'Blog created successfully', blog: blogCreate })
  } catch (error) {
    console.error('Error creating blog:', error)
    res.status(500).json({ message: 'Error creating blog' })
  }
})
//This is for Admin Login

const adminSchema = new mongoose.Schema({
  id: String,
  name: String,
  phone: String,
  email: String,
  password: String,
})
const Admin = mongoose.model('Admin', adminSchema)
//This is schema for Report page
const ReportSchema = new mongoose.Schema({
  ReportMakerEmail: String, // Change to ReportMakerEmail
  OffenderEmail: String, // Change to OffenderEmail
  ReportLink: String, // Change to ReportLink
  ReportDesc: String, // Change to ReportDesc
})

const Report = mongoose.model('Report', ReportSchema)

server.post('/ReportCreation', async (req, res) => {
  console.log(req)
  try {
    const NewReport = new Report()
    NewReport.ReportMakerEmail = req.body.ReportMakerEmail
    NewReport.OffenderEmail = req.body.OffenderEmail
    NewReport.ReportLink = req.body.ReportLink
    NewReport.ReportDesc = req.body.ReportDesc

    await NewReport.save()
    res.status(200).json({ message: 'Report created successfully' })
  } catch (error) {
    console.error('Error creating Report:', error)
    res.status(500).json({ message: 'Error creating Report' })
  }
})

server.post('/AdminLogin', async (req, res) => {
  try {
    const { AdminEmail, AdminPassword } = req.body
    const admin = await Admin.findOne({ email: AdminEmail })
    if (admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }
    if (AdminPassword === Admin.password) {
      return res.status(200).json({ message: 'Admin logged in successfully' })
    } else {
      return res.status(401).json({ message: 'Incorrect password' })
    }
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
// ...

// This is for Login
server.post('/Login', async (req, res) => {
  try {
    const { lemail, lpassword } = req.body
    emaill = req.body.lemail

    // Find the user with the provided username
    const user = await User.findOne({ email: lemail })

    // Check if the user exists and the password matches
    if (user && user.password === lpassword) {
      res.status(200).json({ message: 'Login successful' })
    } else {
      res.status(401).json({ error: 'Invalid username or password' })
    }
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})
//This is for to profiles
server.get('/Profiles', async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    console.error('Error fetching profiles:', err)
    res.status(500).json({ error: 'An error occurred' })
  }
})
//This is For to Show Quizes
server.get('/ShowBlogs', async (req, res) => {
  try {
    const quizData = await Blog.find()
    res.status(200).json(quizData)
  } catch (error) {
    console.error('Error fetching the data', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

//Create Delete api
server.delete('/DeletePost', async (req, res) => {
  const DEmail = req.body.DEmail
  const ImageId = req.body.ImageId
  console.log(req.body.ImageId, 'hello')

  try {
    // Find the user by their email
    const user = await User.findOne({email:DEmail})

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Find the index of the image with the matching _id
    const imageIndex = user.image.findIndex(
      
      (image) =>
      
      image._id.toString() === ImageId
       
    )
    console.log(imageIndex,"imageindex")
    

    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found' })
    }

    // Remove the image from the array
    user.image.splice(imageIndex, 1)

    // Save the user document
    await user.save()

    return res.status(200).json({ message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error deleting image:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Create an endpoint to fetch quiz data
server.get('/ShowQuiz', async (req, res) => {
  try {
    const quizData = await Quiz.find()
    res.status(200).json(quizData)
  } catch (error) {
    console.error('Error fetching the data', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

server.get('/Profile', async (req, res) => {
  console.log(emaill)
  try {
    const user = await User.findOne({ email: emaill })
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

server.use(express.json())

// ... your existing routes ...

server.post('/CreatePost', upload.single('image'), async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (req.file) {
      const imageObject = {
        description: req.body.description,
        data: req.file.buffer,
        contentType: req.file.mimetype,
        selectedOption: req.body.selectedOption, // Retrieve selectedOption from the request body
      }

      // Push the new image object to the image array
      user.image.push(imageObject)

      // Save the user document
      await user.save()

      return res.status(200).json({ message: 'Post created successfully' })
    } else {
      return res.status(400).json({ error: 'No image file received' })
    }
  } catch (error) {
    console.error('Error creating post:', error)
    return res.status(500).json({ error: 'An error occurred' })
  }
})

//This is for update Profile
server.post('/updateProfile', (req, res) => {
  const { username, password, college, email, phone } = req.body
  User.collection('users').findOneAndUpdate(
    { emaill: email },
    {
      $set: {
        username,
        password,
        college,
        email,
        phone,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error('Error updating profile:', err)
        res.json({ success: false })
      } else {
        console.log('Profile updated successfully')
        res.json({ success: true })
      }
    },
  )
})
//Map a images of Reports for Admin Dashboard

server.get('/ShowReports', async (req, res) => {
  try {
    const reports = await Report.find();
    const users = await User.find();

    const matchedData = [];

    // Loop through reports and users to find matches
    for (const report of reports) {
      for (const user of users) {
        if (
          report.OffenderEmail=== user.email 
          
        ) {
         
          const matchedItem = {
            report,
            user,
            
          };

          matchedData.push(matchedItem);
        }
      }
    }

    res.json(matchedData);
    console.log(matchedData) // Send the matched data with image as a JSON response to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});




server.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

server.listen(5000, () => {
  console.log('Server is running on port 5000')
})
