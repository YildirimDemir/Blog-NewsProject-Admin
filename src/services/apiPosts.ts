import { getSession } from "next-auth/react";
import { signIn } from "next-auth/react";

export async function getPosts(userId?: string, categoryId?: string) {
    try {
        const session = await getSession();
        if (!session || !session.user || !session.user.email) {
            signIn();
            return;
        }

        const queryParams = new URLSearchParams();
        if (userId) {
            queryParams.append('userId', userId);
        }
        if (categoryId) {
            queryParams.append('categoryId', categoryId);
        }

        const res = await fetch(`${process.env.ADMIN_API_URL}/api/posts?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.user.email}`
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch posts");
        }

        if (data && Array.isArray(data.posts)) {
            return data.posts;
        } else {
            throw new Error('Unexpected data format');
        }
    } catch (error) {
        throw error;
    }
}


export async function createPost(newPost: { title: string; text: string; image?: string; category: string }) {
    try {
        const session = await getSession();
        if (!session || !session.user || !session.user.email) {
            throw new Error('User not authenticated');
        }

        const res = await fetch(`${process.env.ADMIN_API_URL}/api/posts`, {
            method: "POST",
            body: JSON.stringify({
                ...newPost,
                author: session.user.email 
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to create post");
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating post:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        throw error;
    }
}

export async function getPostById(id: string) {
    try {
        const session = await getSession();
        if (!session || !session.user || !session.user.email) {
            throw new Error('User not authenticated');
        }

        const res = await fetch(`${process.env.ADMIN_API_URL}/api/posts/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.user.email}`
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch post");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export async function updatePost(id: string, updatedData: { title?: string; text?: string; image?: string; category?: string }) {
    try {
        const res = await fetch(`${process.env.ADMIN_API_URL}/api/posts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(updatedData),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to update post");
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating post:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        throw error;
    }
}

export async function deletePost(id: string) {
    try {
        const res = await fetch(`${process.env.ADMIN_API_URL}/api/posts/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to delete post");
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting post:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        throw error;
    }
}