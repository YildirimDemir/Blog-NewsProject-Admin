import { getSession } from "next-auth/react";

export async function getCategories() {
    try {
        const session = await getSession();
        if (!session || !session.user || !session.user.email) {
            throw new Error('User not authenticated');
        }

        const res = await fetch(`${process.env.ADMIN_API_URL}/api/categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.user.email}`
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch categories");
        }

        console.log('Fetched categories:', data); // Debugging
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}


export async function createCategory(newCategory: { name: string }) {
    try {
        const res = await fetch(`${process.env.ADMIN_API_URL}/api/categories`, {
            method: "POST",
            body: JSON.stringify(newCategory),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to create category");
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating category:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        throw error;
    }
}

export async function updateCategory(id: string, updatedData: { name?: string }) {
    try {
        const res = await fetch(`${process.env.ADMIN_API_URL}/api/categories/${id}`, {
            method: "PATCH",
            body: JSON.stringify(updatedData),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to update category");
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating category:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        throw error;
    }
}

export async function deleteCategory(id: string) {
    try {
        const res = await fetch(`${process.env.ADMIN_API_URL}/api/categories/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to delete category");
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting category:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        throw error;
    }
}

export async function getCategoryById(id: string) {
    try {
        const session = await getSession();
        if (!session || !session.user || !session.user.email) {
            throw new Error('User not authenticated');
        }

        const res = await fetch(`${process.env.ADMIN_API_URL}/api/categories/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.user.email}` 
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch category");
        }

        return data;
    } catch (error) {
        throw error;
    }
}
