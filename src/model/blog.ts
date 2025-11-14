
// Node modules
import { Schema, model, Types } from 'mongoose';

// Custom modules
import { genSlug } from '@/utils';

export interface IBlog {
    title : string,
    slug : string,
    content : string,
    banner : {
        publicId : string,
        url : string,
        width : number,
        height : number
    },
    author : Types.ObjectId,
    viewCount : number,
    likeCount : number,
    commentCount : number,
    status : 'draft' | 'published'

};

const blogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            maxLength : [180, 'Title must be less than 180 characters'],
            required : [true, 'Title is required']
        },
        slug : {
            type: String,
            unique : [true, 'Slug must be unique'],
            required : [true, 'Slug is required']
        },
        content : {
            type: String,
            required : [true, 'Content is required']
        },
        banner : {
            publicId:{
                type: String,
                required : [true, 'Banner public id is required']
            },
            url:{
                type: String,
                required : [true, 'Banner url is required']
            },
            width:{
                type: Number,
                required : [true, 'Banner width is required']
            },
            height:{
                type: Number,
                required : [true, 'Banner height is required']
            }
        },
        author : {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required : [true, 'Author is required']
        },
        viewCount : {
            type: Number,
            default: 0
        },
        likeCount : {
            type: Number,
            default : 0
        },
        commentCount : {
            type: Number,
            default: 0
        },
        status : {
            type: String,
            enum: {
                values: ['draft','published'],
                message : '{VALUE} is not supported'
            },
            default : 'draft'
        }

    },
    {
        timestamps : {
            createdAt : 'publishedAt'
        }
    }
);

blogSchema.pre('validate', function(next) {
    if(this.title && !this.slug) {
        this.slug = genSlug(this.title);
    }
    next();
});

export default model<IBlog>('Blog', blogSchema);