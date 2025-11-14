// Node modules
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    username: string,
    email: string;
    password: string;
    role: 'admin'| 'user';
    firstname?: string;
    lastname?: string;
    socialurls?: {
        website?:string;
        facebook?:string;
        instagram?:string;
        linkedin?:string;
        x?:string;
        youtube?:string;
    }
}


// User Schema
const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            maxLength: [20, 'username must be less than 20 characters'],
            unique: [true, 'Username must be unique']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            maxLength: [50, 'Email must be less than 50 characters'],
            unique: [true, 'Email must be unique']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: {
                values: ['admin', 'user'],
                message: '{VALUE} is supported'
            },
            default: 'user'
        },
        firstname: {
            type: String,
            maxLength: [20, 'Firstname must be less than 20 characters']
        },
        lastname: {
            type: String,
            maxLength: [20, 'Lastname must be less than 20 characters']
        },
        socialurls: {
            website: {
                type: String,
                maxLength: [100, 'Website url must be less than 20 characters']
            },
            facebook: {
                type: String,
                maxLength: [100, 'Facebook Profile url must be less than 20 characters']
            },
            instagram: {
                type: String,
                maxLength: [100, 'Instagram Profile url must be less than 20 characters']
            },
            linkedin: {
                type: String,
                maxLength: [100, 'Linkedin Profile url must be less than 20 characters']
            },
            x: {
                type: String,
                maxLength: [100, 'X Profile url must be less than 20 characters']
            },
            youtube: {
                type: String,
                maxLength: [100, 'Youtube channel url must be less than 20 characters']
            }
        }

    },
    {
        timestamps: true
    }
);

// Pre-save middleware for hash password
userSchema.pre('save', async function(next) {

    // If password doesn't changed, skip hashing
    if (!this.isModified('password')) {
         next();
         return;
    }
    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);

})

export default model<IUser>('User', userSchema);