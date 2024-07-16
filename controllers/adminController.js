const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary')


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

            await admin.save();
            res.json({message: 'Super Admin account Created Successfully'})

        } catch (error) {
            return res.status(500).json({error: 'Sorry, but only one super admin account can be created'})
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
                {expiresIn: '100d'}
            );

            const adminProfile = {
                id: admin._id,
                email: admin.email,
                role: admin.role,
                phone_no: admin.phone_no,
                image: admin.image,
                address: admin.address,
                gender: admin.gender,
                emergency_contact_name: admin.emergency_contact_name,
                emergency_contact_phone: admin.emergency_contact_phone,
                emergency_contact_relationship: admin.emergency_contact_relationship,
                username: admin.username,
                start_date: admin.start_date,
                employment_type: admin.employment_type,
                salary: admin.salary,
                position: admin.position
            }

            res.json({token, adminProfile})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    createEmployeeAdmin: async (req, res) => {
        try {
            const {
                fullname,
                email,
                address,
                phone_no,
                gender,
                emergency_contact_name,
                emergency_contact_relationship,
                emergency_contact_phone,
                employee_id,
                username,
                password,
                position,
                start_date,
                employment_type,
                salary,
            } = req.body;
            // console.log('Request body:', req.body)
            console.log('Fullname:', fullname)
    
            // Ensure that only Super Admin can create admin accounts
            if (req.admin.role !== 'Super Admin') {
                return res.status(403).json({error: 'Only Super Admin can create Employee Admin accounts.'});
            }
    
            // Validate required fields
            if (!password) {
                return res.status(400).json({error: 'Password is required'});
            }
    
            let imageUrl = null;
    
            // Check if a file was uploaded
            if (req.file) {
                try {
                    // Upload employee photo to Cloudinary
                    const result = await cloudinary.uploader.upload(req.file.path, {
                        folder: 'employee_photos'
                    });
                    imageUrl = result.secure_url;
                } catch (uploadError) {
                    console.error('Error uploading image to Cloudinary:', uploadError);
                    return res.status(500).json({error: 'Error uploading to Cloudinary'});
                }
            }
    
            const saltRounds = 10;
    
            // Generate hash for the password
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            const employeeAdmin = new Admin({
                fullname,
                image: imageUrl,
                email,
                role: 'Employee Admin',
                password: hashedPassword,
                address,
                phone_no,
                gender,
                emergency_contact_name,
                emergency_contact_relationship,
                emergency_contact_phone,
                employee_id,
                username,
                position,
                start_date,
                employment_type,
                salary,
                isActive: true
            });
    
            await employeeAdmin.save();
    
            res.status(201).json({message: 'Employee Admin account created successfully.'});
        } catch (error) {
            console.error('Error creating Employee admin:', error);
            return res.status(500).json({error: error.message});
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
    getSingleAdminDetails: async(req, res) => {
        try {
            const adminId = req.params.id;

            const adminProfile = await Admin.findById(adminId);

            if(!adminProfile){
                return res.status(404).json({error: 'Admin Profile not found'})
            }
            res.json(adminProfile)
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    deleteEmployeeAdmin: async (req, res) => {
        try {
            //Ensuring that only Super Admin can delete Employee Admin account
            if (req.admin.role !== 'Super Admin') {
                return res.status(403).json({error: 'Only Super Admin can perform this action'})
            }

            const EmployeeAdminId = req.params.id;

            await Admin.findByIdAndDelete(EmployeeAdminId);

            res.json({message: 'Employee Admin account deleted Successfully'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please try again'})
        }
    },
    deactivateEmployeeAdmin: async(req, res) => {
        try {
            //Ensuring that only Super Admin can deactivate Employee admin account
            if(req.admin.role !== 'Super Admin') {
                return res.status(403).json({error: 'Only Super Admin can perform this action'})
            }

            const employeeAdminId = req.params.id;

            const employeeAdmin = await Admin.findById(employeeAdminId);

            employeeAdmin.isActive = false;

            await employeeAdmin.save();
            res.json({message: 'Employee Admin deactivated Successfully', employeeAdmin})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    activateEmployeeAdmin: async (req, res) => {
        try {
            //Ensure that only Super Admin can perform this action
            if(req.admin.role !== 'Super Admin'){
                return res.status(403).json({error: 'Only Super Admin can perform this action'})
            }
            const employeeAdminId = req.params.id;

            const employeeAdmin = await Admin.findById(employeeAdminId);

            employeeAdmin.isActive = true;
            await employeeAdmin.save();
            res.json({message: 'Employee Admin activated successfully', employeeAdmin})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    fetchAllUsers: async (req, res) => {
        try {
            
            console.log('Authenticated Admin:', req.admin);
            const users = await User.find();
            console.log('Users fetched', users)
            res.json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({ error: 'Ooops!! an error occurred, please refresh' });
        }
    },
    getSingleUserDetails: async (req, res) => {
        try {
            const userId = req.params.id;

            const user = await User.findById(userId);

            if(!user){
                return res.status(404).json({error: 'User not found'})
            }
            res.json(user);
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    updateEmployeeAdminDetails: async (req, res) => {
        try {
            const {
                fullname,
                image,
                password,
                address,
                phone_no,
                gender,
                emergency_contact_name,
                emergency_contact_relationship,
                emergency_contact_phone,
                username,
                position
            } = req.body;

            const EmployeeAdminId = req.params.id;

            let employeeAdmin = await Admin.findById(EmployeeAdminId);

            if (!employeeAdmin) {
                return res.status(404).json({error: 'Employee Admin not found'})
            }

            employeeAdmin.fullname = fullname;
            employeeAdmin.username = username;
            employeeAdmin.image = image;
            employeeAdmin.address = address;
            employeeAdmin.phone_no = phone_no;
            employeeAdmin.gender = gender;
            employeeAdmin.emergency_contact_name = emergency_contact_name;
            employeeAdmin.emergency_contact_relationship = emergency_contact_relationship;
            employeeAdmin.emergency_contact_phone = emergency_contact_phone;
            employeeAdmin.position = position;
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