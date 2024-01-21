const User = require('../models/User');

const userController = {
    signUp: async (req, res) => {
        //SignUp is done with email and password
        try {
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    signIn: async (req, res) => {
        //SignIn is done with email and password
        try {
            
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
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    editAccountProfile: async (req, res) => {
        try {
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'}) 
        }
    },
    deleteAccount: async (req, res) => {
        try {
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    }
}
module.exports = userController;