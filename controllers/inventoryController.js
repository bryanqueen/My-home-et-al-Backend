const Inventory = require('../models/Inventory');

const inventoryController = {
    getStockQuantity: async (req, res) => {
        //Function to Get the current stock quantity for a product
        try {
          const productId = req.params.id
          const inventoryEntry = await Inventory.findOne({product: productId})

          if(inventoryEntry){
            return res.status(200).json({quantity: inventoryEntry.quantity})
          } else {
            return res.status(404).json({error: 'Inventory Not found for the specified product'})
          }
        } catch (error) {
            return res.status(500).json({error: 'An error occured while fetching stock quantity'})
        }
    },
    updateStockOnPurchase: async (req, res) => {
        //Function to update stock quantity on purchase
        try {
            const productId = req.params.id;
            const quantityPurchased = req.body.quantityPurchased;

            await Inventory.findOneAndUpdate(
                { product: productId },
                { $inc: { quantity: -quantityPurchased } }
              );
        } catch (error) {
            return res.status(500).json({error: 'Error Updating Stock on Purchase'})
        }
    },
    updateStockOnArrival: async (req, res) => {
        //Function to update stock quantity on Arrival
        try {
            const productId = req.params.id;
            const quantityArrived = req.params.quantityArrived;

            await Inventory.findOneAndUpdate(
                { product: productId },
                { $inc: { quantity: quantityArrived } }
              );
        } catch (error) {
            return res.status(500).json({error: 'Error Updating Stock on Arrival'})
        }
    }
}
module.exports = inventoryController;