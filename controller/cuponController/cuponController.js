const CouponModel = require('../../models/cuponModel/couponomdel')
const productModel = require('../../models/product/productSchema');
const cron = require('node-cron');
const generateUniqueCodeWithPrefix = require('../../helper/codegenerate');

const prefix = 'COUPON-' ;
const length = 12;

const createCoupon = async (req, res) => {
    const {discount, maxUsage, description, status, productId } = req.body;

    const uniquecode = generateUniqueCodeWithPrefix(prefix,length);
    console.log(uniquecode);

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    const found = await productModel.findById({ _id: productId });
    const AdminId =found.createdBy
    console.log(found.createdBy);

    if(!found) return res.status(400).josn({message:"cannot find the product!!!"});
    if(!maxUsage) return res.status(400).json({message:"please enter the maxUsage"});
    if(!discount) return res.status(400).json({message:"please enter the discount"});
    if(!description) return res.status(400).json({message:"please enter the description"});
    if(!status) return res.status(400).json({message:"please enter the status"});
    if(!startDate) return res.status(400).json({message:"please enter the startDate"});
    if(!endDate) return res.status(400).json({message:"please enter the endDate"});


    const cuponCreated = await CouponModel.create({ ...req.body, code: uniquecode, startDate: startDate, endDate: endDate, AdminId: AdminId});
    if (!cuponCreated) return res.status(500).json({ message: 'error creating coupon!!!' })
    if (new Date(endDate).getDate() === startDate.getDate()) {
        cuponCreated.status = 'inactive';
        await cuponCreated.save();
    } 
    return res.status(200).json({ message: 'cupon has been successfully created', cuponCreated: cuponCreated});
}

const AllCoupons = async (req, res) => {
    try {
        console.log("cupons...");
        
        const coupons = await CouponModel.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ message: 'All Coupons', coupons:coupons });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
}
const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const {code,productId, discount, maxUsage, endDate, description, startDate } = req.body;
        const queryObject = {};
        const today = new Date();

        if (code) queryObject.code = code;
        if (productId) queryObject.productId = productId;
        if (discount) queryObject.discount = discount;
        if (maxUsage) queryObject.maxUsage = maxUsage;
        if (startDate) queryObject.startDate = startDate;
        if (endDate) {
            req.body.endDate = new Date(endDate);
            if (req.body.endDate.getDate() === today.getDate()) {
                queryObject.status = 'inactive';
            }
            queryObject.endDate = req.body.endDate
        };
        if (description) queryObject.description = description;


        const newData = await CouponModel.findOneAndUpdate({ _id: id },
            { ...queryObject }, { new: true, runValidators: true });
        if (newData.endDate.getDate() === newData.startDate.getDate()) {
            newData.status = 'inactive'
            await newData.save();
        }
        return res.status(200).json({ message: 'Data has been update successfully', newData: newData });
    }
    catch (error) {
        return res.status(500).json({ error: error })
    }
}
const deleteCoupon = async (req, res) => {
    try {
        const deletedData = await CouponModel.deleteMany({
            _id: {
              $in: req.body.ids
            }
          },{
            new: true
    });
        console.log(deletedData);
        return res.status(200).json({ message: 'Deleted successfully', deletedData: deletedData });
    }
    catch (error) {
        return res.status(500).json({ erorr: 'Error deleting Data' })
    }
}
// const getCouponByOrganizer = async (req, res) => {
//     try {
//         const organizerId = req.params.id;
//         const found = await CouponModel.find({ organizerId: organizerId })
//         return res.status(200).json({ message: 'All the coupon created by organizer', found: found });
//     } catch (error) {
//         return res.status(500).json({ error: 'error getting couppons' })
//     }
// }


const updateCouponStatus = async () => {
    try {
        const today = new Date();
        const coupons = await CouponModel.find({ endDate: today });
        for (const coupon of coupons) {
            coupon.status = 'inactive';
            await coupon.save();
        }
        const used = await CouponModel.find({ usage: { $gte: maxUsage } });
        for (const uses of used) {
            uses.status = 'inactive';
            await uses.save();
        }
        console.log('coupon status has been updated successfully');
    }
    catch (error) {
        console.log('error updating coupons status');
    }
}
cron.schedule('0 0 * * *', updateCouponStatus);//it will execute the code every day midnight 00:00


module.exports = { createCoupon, deleteCoupon, updateCoupon, AllCoupons};

