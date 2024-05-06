const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminController = {
    signUp: async (req, res) => {
        try {
            //Check if there are any existing admins
            const existingAdmin = await Admin.findOne();
            const adminRole = existingAdmin ? 'Employee Admin' : 'Super Admin';

            const {username, email, password} = req.body;

            const saltHash = 10;

            const hashedPassword = await bcrypt.hash(password, saltHash);
            //Create Admin Account
            const admin = new Admin({
                username,
                email,
                password: hashedPassword,
                role: adminRole
            });

            await admin.save()
        } catch (error) {
            return resizeBy.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    signIn: async (req, res) => {
        try {
            const {email, password} = req.body;

            const admin = await Admin.findOne({email});

            if(!admin){
                return res.status(422).json({error: 'Invalid email or passsword'})
            }

            const passwordMatch = await bcrypt.compare(password, admin.password);

            if(!passwordMatch){
                return res.status(422).json({error: 'Invalid email or password'})
            }

            //Generate token
            const token = jwt.sign(
                {id: admin._id, email: admin.email, role: admin.role},
                process.env.JWT_SECRET,
                {expiresIn: '6h'}
            );

            res.json({token})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    createEmployeeAdmin: async (req, res) => {
        try {
            const {username, email,  password} = req.body;
            //Ensuring that only Super Admin can create admin account
            if (req.admin.role !== 'Super Admin') {
                return res.status(403).json({error: 'Only Super Admin can create Employee Admin accounts.'})
            }

            const saltHash = 10;

            //Generate hash for the password
            const hashedPassword = await bcrypt.hash(password, saltHash);

            const employeeAdmin = new Admin({
                username,
                email,
                role: 'Employer Admin',
                password: hashedPassword
            });

            await employeeAdmin.save();

            res.status(201).json({message: 'Employee Admin account created successfully.'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    getAllEmployeeAdmins: async (req, res) => {
        try {
            //Ensure only Super Admin get all Employee Admins
            if(req.admin.role !== 'Super Admin'){
                return res.status(403).json({error: 'Only Super Admin has access.'})
            }

            //Find all Employee Admins
            const employeeAdmins = await Admin.find({role: 'Employee Admin'});
            res.json(employeeAdmins)
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    deleteEmployeeAdmin: async (req, res) => {
        try {
            //Ensuring that only Super Admin can delete Employee Admin account
            if (!req.admin.role !== 'Super Admin') {
                return res.status(403).json({error: 'Only Super Admin can delete Employee Admin account'})
            }

            const EmployeeAdminId = req.params.id;

            await Admin.findByIdAndDelete(EmployeeAdminId);

            res.json({message: 'Employee Admin account deleted Successfully'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please try again'})
        }
    },
    updateEmployeeAdminDetails: async (req, res) => {
        try {
            const {username, password} = req.body;

            const EmployeeAdminId = req.params.id;

            let employeeAdmin = await Admin.findById(EmployeeAdminId);

            if (!employeeAdmin) {
                return res.status(404).json({error: 'Employee Admin not found'})
            }

            employeeAdmin.username = username;
            //Other Additional data can come in this format.

            //Update Password if Provided
            if (password) {
                employeeAdmin.password = await bcrypt.hash(password, 10)
            }

            //Save the updated Employee Admin account
            employeeAdmin = await employeeAdmin.save();
            res.json({message: 'Employee Admin details updated successfully'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please try again'})
        }
    }
};
module.exports = adminController;