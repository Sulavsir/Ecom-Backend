
const Blog = require('../../models/blogModel/blogmodel');
const fs = require('fs');
//const mongoose = require('mongoose');
//const multer = require('multer');


const create_Blog = async (req,res) =>{
    const {description, category, title} = req.body;
    const picture = req.files[0];
    if(!description) throw new BadRequestError();
    if(!category) throw new BadRequestError();
    if(!title) throw new BadRequestError();
    req.body.image = picture.path;
    
    try{
        const blog = await Blog.create({...req.body}); 
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
    const description = req.body.description;
    if(image){
        const customer = await Blog.findOne({ _id: userid });
        const previousImage = customer.photo;

      // Delete the previous image
      if (previousImage) {
      const imagePath = `uploads/images/${previousImage}`; // Provide the correct path to your images
      try {
        fs.unlinkSync(imagePath); // Delete the file
       } catch (error) {
          console.error(`Error deleting previous image: ${error.message}`);
            }
        }
        await BlogModel.findOneAndUpdate(
            {_id: userid},
            {$set:{image : image}},
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
    Blog.find({status: "published"}).sort({createdAt: -1 }).exec((error,blogs) =>{
        if(error){
            return res.status(500).json({error:'error finding blog'})
        }
        if(!blogs.length){
            return res.status(500).json({error:'No blogs'});
        }
        return res.status(200).json({title:'All Blogs', blog: blogs});
    })
}

const delete_Blog =async(req,res) =>{
 const id = req.params.id;
 Blog.findByIdAndRemove({_id:id},(error,blog)=>{
    if(error){
        return res.status(500).json({error:'occured error deleting blog'});
    }
    //res.redirect('/index_blog');
    res.json({message: 'blog has been deleted successfully',blog : blog});
 });
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
module.exports = {create_Blog,update_Blog,index_Blog,delete_Blog,search_Blog}