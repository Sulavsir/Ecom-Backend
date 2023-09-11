const ItemQuery = require('./productquery');

function getAllItem(req, res, next) {
  let condition = {};
//   if (req.user.role !== 1) {
//     condition.createdBy = req.user._id;
//   }
  ItemQuery
    .find(condition)
    .then(function (item) {
      res.json(item);
    })
    .catch(function (err) {
      next(err);
    })

}

function insert(req, res, next) {
  const data = req.body;
  // todo prepare data
  // eg .images, createdBy
  console.log('req.body is >.>', req.body)
  console.log('req.files >>', req.files)
  data.images = req.files.map(function (item, index) {
    return item.filename;
  })
  data.createdBy = req.user._id;
//    data.createdBy = req.user._id;

  ItemQuery
    .insert(data)
    .then(function (response) {
      res.json(response);
    })
    .catch(function (err) {
      next(err);
    })
}

function getById(req, res, next) {
  let condition = {
    _id: req.params.id
  }
  ItemQuery
    .find(condition)
    .then(function (item) {
      if (item && item.length) {
        return res.json(item[0])
      }
      next({
        msg: 'Item Not Found',
        status: 404
      })
    })
    .catch(function (err) {
      next(err);
    })
}

function search(req, res, next) {
    let searchCondition = {};
  
    if (req.body.category) {
      searchCondition.category = req.body.category;
    }
  
    if (req.body.brand) {
      searchCondition.brand = req.body.brand;
    }
  
    if (req.body.modelNo) {
      searchCondition.modelNo = req.body.modelNo;
    }
  
    if (req.body.minPrice || req.body.maxPrice) {
      searchCondition.price = {};
  
      if (req.body.minPrice) {
        searchCondition.price.$gte = req.body.minPrice;
      }
  
      if (req.body.maxPrice) {
        searchCondition.price.$lte = req.body.maxPrice;
      }
    }
  
    if (req.body.fromDate && req.body.toDate) {
      const fromDate = new Date(req.body.fromDate).setHours(0, 0, 0, 0);
      const toDate = new Date(req.body.toDate).setHours(23, 59, 59, 999);
  
      searchCondition.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }
  
    if (req.body.tags) {
      searchCondition.tags = {
        $in: req.body.tags.split(','),
      };
    }
  
    console.log('search condition >>', searchCondition);
  
    ItemQuery
      .find(searchCondition)
      .then(function (items) {
        res.json(items);
      })
      .catch(function (err) {
        next(err);
      });
  }
  

function update(req, res, next) {
  const data = req.body;
  data.updatedBy = req.user._id;
  const newImages = req.files.map(function (item, index) {
    return item.filename;
  })
  data.newImages = newImages;
  // todo append information indata
  ItemQuery
    .update(data, req.params.id)
    .then(function (item) {
      res.json(item);
    })
    .catch(function (err) {
      next(err);
    })
}


function remove(req, res, next) {
  // todo append information indata
  ItemQuery
    .remove(req.params.id)
    .then(function (item) {
      if (item) {
        return res.json(item);
      }
      next({
        msg: 'Item not found',
        status: 404
      })


    })
    .catch(function (err) {
      next(err);
    })
}

function addRatings(req, res, next) {
    const uploadedFile = req.files;
  const data = req.body;
  console.log('....',uploadedFile)
  if (!(req.body.message && req.body.point)) {
    return next({
      msg: 'Please provide message and point',
      status: 400
    })
  }
  // append user in data
  data.user = req.user._id;
  data.image = uploadedFile.map(file => file.filename);
  ItemQuery
    .addRatings(data, req.params.item_id)
    .then(function (item) {
      res.json(item);
    })
    .catch(function (err) {
      next(err);
    })
}

module.exports = {
  getAllItem,
  getById,
  search,
  insert,
  update,
  remove,
  addRatings
}