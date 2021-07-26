const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const Employee = require('./models/Employee');

app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
});

db.once('open', () => {
    console.log('Database Connection Established!');
    // const PORT = process.env.PORT || 3000;
    const PORT = 3001;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    app.post("/insert", async (req, res) => {
        const name = req.body.name;
        const designation = req.body.designation;
        const email = req.body.email;
        const phone = req.body.phone;
        const age = req.body.age;

        const employee = new Employee({
            name: name,
            designation: designation,
            email: email,
            phone: phone,
            age: age
        });

        try {
            await employee.save();
            res.send("inserted data");
        } catch (err) {
            console.log(err);
        }
    });


    app.get("/read", async (req, res) => {
        // Employee.find({$where: {name: 'maruf'}}, (err, result))
        Employee.find({}, (err, result) => {
            if (err) {
                res.send(err);
            }

            res.send(result);
        });
    });


    app.put("/update", async (req, res) => {
        const newEmployeeName = req.body.newEmployeeName;
        const id = req.body.id;

        try {
            await Employee.findById(id, (err, updatedEmployee) => {
                updatedEmployee.name = newEmployeeName;
                updatedEmployee.save();
                res.send("update");
            })
        } catch (err) {
            console.log(err);
        }
    });


    app.delete("/delete/:id", async (req, res) => {
        const id = req.params.id;

        await Employee.findByIdAndRemove(id).exec();
        res.send("deleted");
    })

});




