const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

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
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    createEmployeeAdmin: async (req, res) => {
        try {
            //Ensuring that only Super Admin can create admin account
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    getAllEmployeeAdmins: async (req, res) => {
        try {
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    deleteEmployeeAdmin: async (req, res) => {
        try {
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please try again'})
        }
    },
    updateEmployeeAdminDetails: async (req, res) => {
        try {
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please try again'})
        }
    }
};
module.exports = adminController;