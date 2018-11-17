const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');

const mor = require('method-override');

const Employee = require('../models');

const sessionConfig = require('../config/express-session');

const router = express.Router();

// method override
router.use(mor('_method'));

// express-session middleware
router.use(session({
    secret: sessionConfig.session.secret,
    resave: sessionConfig.session.resave,
    saveUninitialized: sessionConfig.session.saveUninitialized
}));

// connect flash middleware
router.use(flash());

// serve the employee form [OK!]
router.get('/add', async (req, res) => {
    res.render('employees/addEmployee', { title: 'Save employee details' });
});

// add new employee [OK!]
router.post('/save', async (req, res) => {
    console.log(req.body);
    let errors = [];
    if (!req.body.fullName) { errors.push({ message: 'Full name is required!' } )}
    if (!req.body.phone) { errors.push({ message: 'Phone is required!' } )}
    if (!req.body.email) { errors.push({ message: 'Email is required!' } )}
    if (!req.body.city) { errors.push({ message: 'City is required!' } )}
    if (errors.length > 0) {
        res.render('employees/save', {
            errors: errors,
            fullName: req.body.fullName,
            phone: req.body.phone,
            email: req.body.email,
            city: req.body.city,
        });
    } else {
        let employee = new Employee({
            fullName: req.body.fullName,
            phone: req.body.phone,
            email: req.body.email,
            city: req.body.city,
        });
        try {
            await employee.save();
            req.flash('success_message', 'Employee details were successfully saved!');
            res.redirect('/employees/list');
        } catch (e) {
            res.status(500).send(e, 'Failed to employee details!');
        }
    }

});

// fetch all employees [OK!]
router.get('/list', async (req, res) => {
    try {
        let employees = await Employee.find().sort({ date: -1 });
        res.render('employees/employees', {employees: employees});
    } catch (e) {
        res.status(500).send(e, 'Failed to retrieve employees from the database!');
    }
});

// serve update employee form [OK!]
router.get('/update/:id', async (req, res) => {
    try {
        let employee = await Employee.findById(req.params.id);
        res.render('employees/updateEmployee', { employee: employee });
    } catch (e) {
        res.status(500).send(e, 'Failed to retrieve employee from the database!');
    }
});

// update an employee [OK!]
router.put('/update/:id', async (req, res) => {
    try {
        await Employee.findByIdAndUpdate(req.params.id, {
            fullName: req.body.fullName,
            phone: req.body.phone,
            email: req.body.email,
            city: req.body.city,
        });
        req.flash('success_message', 'Employee details were successfully updated!');
        res.redirect('/employees/list');
    } catch (e) {
        res.status(500).send(e, 'Failed to update employee!');
    }
});

// delete an employee
router.delete('/delete/:id', async (req, res) => {
    try {
        await Employee.findByIdAndRemove(req.params.id);
        req.flash('success_message', 'Video idea was successfully deleted!');
        res.redirect('/employees/list');
    } catch (e) {
        res.status(500).send(e, 'Failed to delete idea from the database!');
    }
});



module.exports = router;
