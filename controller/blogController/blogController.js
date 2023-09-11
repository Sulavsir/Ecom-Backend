
const Blog = require('../../models/blogModel/blogmodel');
const fs = require('fs');
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink);
//const mongoose = require('mongoose');
//const multer = require('multer');


const create_Blog = async (req,res) =>{
    const {description, category, title} = req.body;
    const images = req.files.map((file) => file.filename);
    if(!description) throw new BadRequestError();
    if(!category) throw new BadRequestError();
    if(!title) throw new BadRequestError();
    
    try{
        const blog = await Blog.create({description, category, title, image:images}); 
        res.status(200).json({message:"successfully created...",blog:blog});
    //res.redirect('/index_blog');
    //res.render('index',{title:'Blogs',blog: blog})
    } catch(error){
            return res.status(500).json({error: error});
        }

};

const update_Blog = async (req, res) => {
    const userid = req.params.id;
    const status = req.body.status === 'published' ? 'published' : 'draft';
    const title = req.body.title;
    const category = req.body.category;
    const tags = req.body.tags;

    const images = req.files.map((file) => file.filename);

    const description = req.body.description;
    if(images){
        const blog = await Blog.findOne({ _id: userid });

      // Delete the previous image
      for (const image of blog.image) {
        try {
          const imagePath = `uploads/images/${image}`;
          
          // Use fs.promises.unlink to delete files asynchronously
          await unlinkAsync(imagePath);
        } catch (error) {
          console.error(`Error deleting image ${image}: ${error}`);
        }
      }
        await Blog.findOneAndUpdate(
            {_id: userid},
            {$set:{image : images}},
            {new: true}
          );   

    }
    const  updated = await Blog.findByIdAndUpdate(
        userid,
        {$set: { title: title, category: category, tags: tags,
                description: description, status: status}}, { new: true }
        );
        if(updated){
            res.status(200).json({message:"successfully updated!!"
            });
        }else res.status(400).json({message:"unsuccessfully!!"});
        
}
const index_Blog = async(req,res) =>{
    console.log("blog...")
   const found = await Blog.find({status: "published"}).sort({createdAt: -1 });
   if(found){
    return res.status(200).json({message:"All the published Blogs...",found:found});
   }else{
    return res.status(400).json({messsage:'there no published Blogs'});
   }
}

const delete_Blogs =async(req,res) =>{
 const ids = req.params.ids;
 const deleted = await Blog.deleteMany({
    _id: {
      $in: ids
    }},{
      new: true
});
if(deleted){
  return res.status(200).json({message:"successfully deleted"});
}else{
  return res.status(400).json({message:"something went worng or not found data..."})
}
}
const search_Blog = async(req,res)=>{
    const id = req.params.id;
    const blog = await Blog.findById({_id:id});
    if (!blog) {
        return res.status(500).json({ error: 'Error deleting Blog' });
    }
    res.json({blog:blog});
    //res.render('detail',{title:'blog detail',blogs: blog});
}
module.exports = {create_Blog,update_Blog,index_Blog,delete_Blogs,search_Blog}