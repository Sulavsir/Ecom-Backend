const orderModel = require('../models/order/orderModel')
// get unique Order Id
// number of length of order;
const numberOfLength = '000';
const prefix = 'ORDER';

const generateOrderID = async () => {
    let orderId = `${prefix}-001`;
  
    try {
      const latestRecord = await orderModel.findOne({}, 'orderId', {
        sort: { createdDateTime: -1 }
      });
      if (latestRecord && latestRecord.orderId) {
        const splittedId = latestRecord.orderId.split('-');
        if (splittedId.length > 1) {
          let isExist = true;
          let orderNumber = parseInt(splittedId[1], 10);
          if (Number.isNaN(orderNumber)) orderNumber = 1;
          do {
            orderNumber += 1;
            orderNumber = numberOfLength + orderNumber.toString();
            const sliceLength = parseInt(
              orderNumber.toString().length > numberOfLength.length
                ? orderNumber.toString().length
                : numberOfLength.length,
              10
            );
            orderNumber = orderNumber.slice(-1 * sliceLength);
            orderId = `${prefix}-${orderNumber}`;
            isExist = await orderModel.findOne({
              orderId
            });
          } while (isExist);
        }
      }
      return orderId;
    } catch (error) {
      console.error('Error generating orderId:', error);
      throw error; // Rethrow the error to handle it at the caller's level
    }
  };


  module.exports = {
    generateOrderID
  }