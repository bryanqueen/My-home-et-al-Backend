const Email = require('../models/Email');


const newsletterController = {
    submitEmailForNewsLetter: async (req, res) => {
        try {
            const {email} = req.body;

            const existingEmail = await Email.findOne({email});

            if(existingEmail){
                return res.status(400).json({error: 'This Email has already been submitted'})
              }

            const newEmailAddress = new Email({
                email
            });
            await newEmailAddress.save();
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
}
module.exports = newsletterController;