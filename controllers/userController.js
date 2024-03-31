const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userController = {
    signUp: async (req, res) => {
        //SignUp is done with email and password
        try {
            const {email, password} = req.body;

            const saltHash = 12;
            const hashedPassword = await bcrypt.hash(password, saltHash);

            const user = new User({
                email,
                password: hashedPassword
            });

            await user.save();

            res.json({message: 'Successfully Created'})
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
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
            const passwordMatch = bcrypt.compare(password, user.password);

            if(!passwordMatch){
                return res.status(422).json({error: 'invalid email or password, please retry'})
            }
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
            const userId = req.userId;
            const profile = await User.findById(userId);

            if (!profile) {
                return res.status(404).json({error: 'Not Found'})
            }
            res.json(profile)
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
            const userId = req.userId;

            const profile = await User.findByIdAndDelete(userId);

            if (!profile){
                return res.status(404).json({error: 'Not Found'})
            }
            res.json({message: 'Deletion Completed'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    }
}
module.exports = userController;