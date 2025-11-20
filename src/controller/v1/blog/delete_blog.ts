
// Node modules
import { v2 as cloudinary } from "cloudinary";

// Custom modules
import { logger } from "@/lib/winston";

// Models
import User from "@/model/user";
import Blog from "@/model/blog";

// Types
import { Request, Response } from "express";


/* 

Logic of the function 

Get userid & Blog id as params
find role of the userid
find blog & select author 's banner 's public id
if blog is not then give 404 error - not found
if author 's blog id and fetched userId && loggedIn user is not admin then give 403 error access denied
destroy picture of cloudinary
delete blog using blog id
give status 201

*/
const deleteBlog = async (req:Request, res:Response) => {
    try {

        const userId = req.userId;
        const blogId = req.params.blogId;

        const user = await User.findById(userId).select("role").exec();
        const blog = await Blog.findById(blogId).select('author banner.publicId').exec();

        // If Blog is not available
        if(!blog) {
            res.status(404).json({
                code : "NotFound",
                message : "Blog not found"
            });
        return;
        }

        // if Blog 's author is doesn't match with userid && role of the loggedin user is not admin
        if(blog.author !== userId && user?.role !== "admin") {
            res.status(403).json({
                code : "AuthorizationError",
                message : "Access denied, Insufficient permission"
            });
        return;
        }

        // Delete image on cloud based on publicId saved in db
        await cloudinary.uploader.destroy(blog.banner.publicId);
        logger.info("Blog banner is deleted from Cloudinary", {
            publicId : blog.banner.publicId
        });

        // Delete Blog based on blogId
        await Blog.deleteOne({ _id : blogId });

        logger.info("Blog deleted successfully", { blogId });

        res.sendStatus(204);

    } catch (err) {
        res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err,
    });

    logger.error('Error while fetching blog by slug', err);
    }
};

export default deleteBlog;