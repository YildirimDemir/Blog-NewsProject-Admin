import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import { connectToDB } from '@/lib/mongodb';
import Post from '@/models/postModel';
import User from '@/models/userModel';

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const userId = new URL(req.url).searchParams.get('userId');
    const categoryId = new URL(req.url).searchParams.get('categoryId');

    const filter: any = {};
    if (userId) {
      filter.author = userId;
    }
    if (categoryId) {
      filter.category = categoryId;
    }

    const posts = await Post.find(filter)
      .populate('author', 'username')
      .populate('category', 'name')
      .exec();

    return NextResponse.json({ count: posts.length, posts }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching posts:', error.message);
      return NextResponse.json({ error: 'Failed to fetch posts', details: error.message }, { status: 500 });
    } else {
      console.error('An unknown error occurred');
      return NextResponse.json({ error: 'Failed to fetch posts', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}

export async function POST(req: NextRequest) {
    try {
      const session = await getServerSession();
      if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ message: "You are not allowed!" }, { status: 401 });
      }
  
      const userEmail = session.user.email;
  
      await connectToDB();
      const user = await User.findOne({ email: userEmail }).exec();
      if (!user) {
        return NextResponse.json({ message: "User not found!" }, { status: 404 });
      }
  
      const allowedRoles = ['admin', 'editor'];
      if (!allowedRoles.includes(user.userRole)) {
        return NextResponse.json({ message: "You do not have permission to create posts." }, { status: 403 });
      }
  
      const { title, text, image, category }: { title: string, text: string, image?: string, category: string } = await req.json();
  
      const newPost = new Post({
        title,
        text,
        image,
        category: new mongoose.Types.ObjectId(category), 
        author: user._id as mongoose.Types.ObjectId,
      });
  
      await newPost.save();
  
      user.posts = user.posts || []; 
      user.posts.push(newPost._id as mongoose.Types.ObjectId); 
      await user.save();
  
      return NextResponse.json({ message: "Post created successfully", post: newPost }, { status: 201 });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error creating post:', error.message);
        return NextResponse.json({ message: 'Failed to create post', details: error.message }, { status: 500 });
      } else {
        console.error('An unknown error occurred');
        return NextResponse.json({ message: 'Failed to create post', details: 'An unknown error occurred' }, { status: 500 });
      }
    }
  }