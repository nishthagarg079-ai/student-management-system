const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

const PORT = 3000;

let students = [
    {
        id: 101,
        name: "Rahul Sharma",
        age: 20,
        course: "B.Tech"
    },
    {
        id: 102,
        name: "Priya Singh",
        age: 21,
        course: "BCA"
    }
];

// GET all students
app.get("/students", async (req, res) => {

    try {

        const students = await Student.find();

        res.json(students);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});

// POST new student
app.post("/students", async (req, res) => {

    try {

        const student = new Student({
            name: req.body.name,
            age: req.body.age,
            course: req.body.course
        });

        const savedStudent = await student.save();

        res.json(savedStudent);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});
// UPDATE student
app.put("/students/:id", async (req, res) => {

    try {

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedStudent);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

});

// DELETE student
app.delete("/students/:id", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});