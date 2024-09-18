import { getSession } from "next-auth/react";
import { IComment } from "@/models/commentModel";

export async function getComments() {
    try {
        const session = await getSession();
        if (!session || !session.user || !session.user.email) {
            throw new Error('User not authenticated');
        }

        const res = await fetch(`${process.env.ADMIN_API_URL}/api/comments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.user.email}`
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch comments");
        }

        return data.comments as IComment[];
    } catch (error) {
        throw error;
    }
}

export async function createComment(postId: string, content: string) {
    try {
        const session = await getSession();
        if (!session || !session.user || !session.user.email) {
            throw new Error('User not authenticated');
        }

        const res = await fetch(`${process.env.ADMIN_API_URL}/api/comments`, {
            method: "POST",
            body: JSON.stringify({ post: postId, content }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.user.email}`
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to create comment");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export async function deleteComment(commentId: string) {
    try {
        const session = await getSession();
        if (!session || !session.user || !session.user.email) {
            throw new Error('User not authenticated');
        }

        const res = await fetch(`${process.env.ADMIN_API_URL}/api/comments/${commentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.user.email}`
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to delete comment");
        }

        return data;
    } catch (error) {
        throw error;
    }
}