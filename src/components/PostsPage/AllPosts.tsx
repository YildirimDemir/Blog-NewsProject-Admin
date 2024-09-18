'use client';

import React, { useEffect, useState } from 'react';
import Style from './allposts.module.css';
import Image from 'next/image';
import { FaRegThumbsUp, FaRegComment } from 'react-icons/fa';
import { getPosts, deletePost } from '@/services/apiPosts';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/firebase';
import Link from 'next/link'; 
import mongoose from 'mongoose';

export default function AllPosts() {
    const [posts, setPosts] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);

    console.log(mongoose.models);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getPosts();

                if (Array.isArray(data)) {
                    const postsWithImages = await Promise.all(data.map(async (post) => {
                        if (post.image) {
                            const imageRef = ref(storage, post.image); 
                            post.imageUrl = await getDownloadURL(imageRef);
                        }
                        return post;
                    }));
                    setPosts(postsWithImages);
                } else {
                    console.error('Unexpected data format:', data);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deletePost(id);
            setPosts(posts.filter(post => post._id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className={Style.allPostsPage}>
            <h1>All Posts</h1>
            <div className={Style.allPosts}>
                {posts.length === 0 ? (
                    <p>No posts created</p>
                ) : (
                    posts.map((post) => (
                        <a href={`${process.env.WEBSITE_API_URL}/posts/${post._id}`} key={post._id} target="_blank" rel="noopener noreferrer"> 
                            <div className={Style.postBox}>
                                <div className={Style.postBoxImg}>
                                    {post.imageUrl && <Image src={post.imageUrl} alt={post.title} width={200} height={200} />}
                                </div>
                                <div className={Style.postBoxInfo}>
                                    <h3><span>Title:</span> {post.title}</h3>
                                    <p><span>Category:</span> {post.category ? post.category.name : 'No category'}</p>
                                    <p><span>Author:</span> {post.author ? post.author.username : 'No author'}</p>
                                    <p><span>Text:</span> {post.text.slice(0, 50)}...</p>
                                </div>
                                <div className={Style.postBoxData}>
                                    <span><FaRegThumbsUp /> {post.likes.length}</span>
                                    <span><FaRegComment /> {post.comments.length}</span>
                                </div>
                                <button onClick={(e) => { e.preventDefault(); handleDelete(post._id); }}>Delete</button>
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}
