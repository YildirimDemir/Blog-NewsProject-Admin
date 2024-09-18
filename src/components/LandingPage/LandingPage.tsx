'use client';

import React, { useEffect, useState } from 'react';
import Style from './landingpage.module.css';
import { getAllUsers } from '@/services/apiUsers';
import { getPosts } from '@/services/apiPosts';
import { getCategories } from '@/services/apiCategories';
import { getComments } from '@/services/apiComments';
import { FaUsers, FaRegNewspaper, FaThLarge, FaRegThumbsUp, FaRegComment } from 'react-icons/fa';

export default function LandingPage() {
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [totalCategories, setTotalCategories] = useState<number>(0);
    const [totalLikes, setTotalLikes] = useState<number>(0);
    const [totalComments, setTotalComments] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await getAllUsers();
                setTotalUsers(users.length);

                const posts = await getPosts();
                setTotalPosts(posts.length);
                const likes = posts.reduce((sum: number, post: { likes: { length: number } }) => sum + (post.likes.length || 0), 0);
                setTotalLikes(likes);

                const categories = await getCategories();
                console.log('Categories fetched:', categories); // Debugging
                setTotalCategories(categories.count);

                const comments = await getComments();
                setTotalComments(comments.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={Style.landingPageArea}>
            <div className={Style.dataContent}>
                <div className={Style.dataBox}>
                    <h3>{totalUsers}</h3>
                    <p>Users</p>
                    <FaUsers className={Style.boxIcon} />
                </div>
                <div className={Style.dataBox}>
                    <h3>{totalPosts}</h3>
                    <p>Posts</p>
                    <FaRegNewspaper className={Style.boxIcon} />
                </div>
                <div className={Style.dataBox}>
                    <h3>{totalCategories}</h3>
                    <p>Categories</p>
                    <FaThLarge className={Style.boxIcon} />
                </div>
                <div className={Style.dataBox}>
                    <h3>{totalLikes}</h3>
                    <p>Likes</p>
                    <FaRegThumbsUp className={Style.boxIcon} />
                </div>
                <div className={Style.dataBox}>
                    <h3>{totalComments}</h3>
                    <p>Comments</p>
                    <FaRegComment className={Style.boxIcon} />
                </div>
            </div>
        </div>
    );
}
