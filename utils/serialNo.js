const Counter = require('../models/counterModel'); // Import the Counter Model

const getNextSerialNo = async (formType) => {
    try {
        const counter = await Counter.findOneAndUpdate(
            { formType },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        return counter.count;
    } catch (error) {
        console.error('Error generating serial number:', error);
        throw error;
    }
};

module.exports = getNextSerialNo;
