/*

We have user_id & from params get slug

Logic --

get user based on userId
find slug from Blog db
if blog not found then 404 error
if user role is "user" && blog status is draft then access denied -- 403 error
send response with blog object


*/
// Custom module
import { logger } from "@/lib/winston";

// Models
import User from "@/model/user";
import Blog from "@/model/blog";

// Types
import type { Request, Response } from "express";

const getBlogBySlug = async(req:Request, res:Response) => {

    try {

        // Get user id & Slug
        const userId = req.userId;
        const slug = req.params.slug;

        // findout user based on userId
        const user = await User.findById(userId).select("role").lean().exec();

        // findout blog based on slug
        const blog = await Blog.findOne({ slug })
        .select("-banner.publicId -__v")
        .populate('author', '-createdAt -updatedAt -__v')
        .lean()
        .exec();

        if(!blog) {
            res.status(404).json({
                code : "NotFound",
                message : "Blog not found"
            })
            return;
        };

        if(user?.role === 'user' && blog?.status === "draft") {
            res.status(403).json({
                code : "AuthorizationError",
                message : "Access denied, Insufficient Permisions"
            })

            logger.warn("User tries to access a deaft blogs", {
                userId,
                blog
            });
            return;
        };

        res.status(201).json({
            blog
        })

    } catch (err) {
        res.status(500).json({
            code : "ServerError",
            message : "Internal Server Error",
            error : err
        });

        logger.error("Error while fetching blogs by Slug", err);

    }
    
};

export default getBlogBySlug;