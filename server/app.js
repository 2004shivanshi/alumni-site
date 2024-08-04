require('dotenv').config();
const express = require('express');
const cors = require("cors");
const passport= require("passport");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
const authRoutes = require("./routes/auth");
const app= express();
const User = require('./model/user.model');
const mongoose = require("mongoose");

// app.use(
//     cookieSession({
//         name :"session",
//         keys:["IES IPS"],
//         maxAge: 24 * 60 * 60 * 100,
//     })
// );

// app.use(passport.initialize());
// app.use(passport.session());
//app.use("./passport",passportSetup)


app.use(express.json());
app.use(cors());

// app.use("/auth",authRoutes)
app.get("/", (req, res) => {
    res.send("Hello ");

})

app.post('/api/auth/update/:id', (req, res) => {
    const { id } = req.params;
    const { clg_email, type_of_job, date_of_joining, department, role, yearOfjoining, current_designation } = req.body;
  
    User.findByIdAndUpdate(id, {
     
        clg_email: clg_email,
        type_of_job: type_of_job,
        date_of_joining: date_of_joining,
        department: department,
        role: role,
        yearOfjoining: yearOfjoining,
        current_designation: current_designation,
      
    }, { new: true })
      .then(updatedUser => {
        if (updatedUser) {
          res.json({ message: 'User updated successfully', user: updatedUser });
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      })
      .catch(error => {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
      });
  });

app.post('/api/auth/google', (req, res) => {
const { name, email, picture } = req.body;
    User.findOne({ email })
      .then(existingUser => {
        if (existingUser) {
          return res.status(200).json({ message: 'User already exists', user: existingUser });
        }
        const user = new User({ name, email, picture });
        return user.save()
          .then(savedUser => res.json({ message: 'User created suceessfully', user: existingUser }))
          .catch(err => res.status(500).json({ error: err }));
      })
      .catch(err => res.status(500).json({ error: err }));
});

const PORT = process.env.PORT ||8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
  });