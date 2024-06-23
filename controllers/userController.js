const User = require('../models/User');
const ProductCategory = require('../models/ProductCategory');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail');


const userController = {
    signUp: async (req, res) => {
        //SignUp is done with email and password
        try {
            const {email, password, firstname, lastname} = req.body;

            //Check if user already exists in the database with the email
            const existingUser = await User.findOne({email});

            if (existingUser) {
                return res.status(400).json({error: 'An account with this email already exists'})
            }
            
            //Generate 5 digit otp
            const otp = crypto.randomInt(10000, 100000);
            const otpExpiry = Date.now() + 10 * 60 * 1000;

            const saltHash = 12;
            const hashedPassword = await bcrypt.hash(password, saltHash);

            const user = new User({
                email,
                firstname,
                lastname,
                password: hashedPassword,
                otp,
                otpExpiry
            });
            
            //send Email OTP
            await sendVerificationEmail(email, otp)

            user.isVerified = false;
            await user.save(); 


            res.json({message: `We sent an OTP to ${email}, please verify `})
            
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    verifyOtp: async (req, res) => {
        try {
            const {email, otp} = req.body;

            //Find user by email
            const user = await User.findOne({email});

            if (!user) {
                return res.status(400).json({error: 'User not found'})
            }
            if(user.otp !== parseInt(otp)){
                return res.status(400).json({error: 'Invalid OTP'})
            }
            if (Date.now() > user.otpExpiry) {
                return res.status(400).json({error: 'OTP expired'})
            }

            //If OTP is valid, clear OTP and OTP EXPIRY
            user.otp = null;
            user.otpExpiry = null;
            user.isVerified = true
            await user.save();

            res.json({message: 'OTP verifed successfully'})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    resendOtp: async(req, res) => {
        try {
            const {email} = req.body;

            //Check if user exists with the email
            const existingUser = await User.findOne({email});

            if(!existingUser){
                return res.status(404).json({error: 'User does not exist'})
            }

            //If User exists, regenerate 5-digit otp
            const otp = crypto.randomInt(10000, 100000);
            const otpExpiry = Date.now() + 10 * 60 * 1000;

            //Resend Mail
            await sendVerificationEmail(email, otp)

            //Set the New Otp and it's expiry time
            existingUser.otp = otp;
            existingUser.otpExpiry = otpExpiry;

            //Re-save User to the database
            await existingUser.save()


        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const {email} = req.body;

            const user = await User.findOne({email});

            if(!user){
                return res.status(404).json({error: 'User does not exist'})
            }

            //If User exists, generate 5-digit otp
            const otp = crypto.randomInt(10000, 100000);
            const otpExpiry = Date.now() + 10 * 60 * 1000;

            //Send mail
            await sendEmail(email, otp);

            //Set the New OTP and it's expiry time
            user.otp = otp;
            user.otpExpiry = otpExpiry;

            //Save newly added Otp
            await user.save();
            res.json({message: `An OTP has been sent to ${email}`})

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    resetPassword: async (req, res) => {
        try {
            const {email, otp, password} = req.body;
            
            const user = await User.findOne({email});

            if(!user){
                return res.status(404).json({error: 'User not found'})
            };
            if(user.otp !== parseInt(otp)){
                return res.status(400).json({error: 'Invalid OTP'})
            }
            if (Date.now() > user.otpExpiry) {
                return res.status(400).json({error: 'OTP expired'})
            }

            const saltHash = 12

            const hashNewPassword = await bcrypt.hash(password, saltHash);

            user.password = hashNewPassword;
            user.otp = null;
            user.otpExpiry = null;

            await user.save()

            res.json({message: 'Password updated successfully'})

        } catch (error) {
            return res.status()
        }
    },
    signIn: async (req, res) => {
        //SignIn is done with email and password
        try {
            const {email, password} = req.body;

            const user = await User.findOne({email});

            if (!user) {
                return res.status(422).json({error: 'Invalid email or password, please retry'})
            }
            const passwordMatch = await bcrypt.compare(password, user.password);

            if(!passwordMatch){
                return res.status(422).json({error: 'invalid email or password, please retry'})
            }

            if(user.isVerified !== true){
                return res.status(422).json({error: 'User email has not been verified'})
            }

            //Generate token
            const token = jwt.sign(
                {id: user._id},
                process.env.JWT_SECRET,
                {expiresIn: '6h'}
            )

            const userProfile = {
                id: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname
            }

            res.json({token, userProfile})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    SignUpWithSocials: async (req, res) => {
        //SignUp is done mainly with either of this two socials: Google or Facebook
        try {
            
        } catch (error) {
            
        }
    },
    SignInWithSocials: async (req, res) => {
        //SignIn is done mainly with either of this two socials: Google or Facebook
        try {
            
        } catch (error) {
            
        }
    },
    viewAccountProfile: async (req, res) => {
        try {
            const userId = req.user._id
            const profile = await User.findById(userId);

            if (!profile) {
                return res.status(404).json({error: 'Not Found'})
            }
            res.json(profile)
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    
    getActiveUsers: async (req, res) => {
        try {
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    editAccountProfile: async (req, res) => {
        try {
            const userId = req.userId
            const { firstName, lastName, email, password} = req.body;

            const updatedProfile = await User.findByIdAndUpdate(
                userId,
                {firstName, lastName, email, password},
                {new: true}
            );
            
            if (!updatedProfile) {
                return res.status(404).json({error: 'Profile not found'})
            }

            res.json({mesage: 'Your Profile has been sucessfully updated'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'}) 
        }
    },
    deleteAccount: async (req, res) => {
        try {

            const {password} = req.body;
            const userId = req.userId;

            const profile = await User.findById(userId);

            if (!profile){
                return res.status(404).json({error: 'Not Found'})
            }
            if(profile.password !== password){
                return res.status(400).json({error: 'Invalid Password'})
            }
            
            await User.findByIdAndDelete(userId);
            res.json({message: 'Account Deleted Successfully'})
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    getProductCategories: async (req, res) => {
        try {
            const productCategories = await ProductCategory.find();

            if(!productCategories){
                return res.status(404).json({error: 'No Product Category found'})
            }
            res.json(productCategories)
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
}
module.exports = userController;