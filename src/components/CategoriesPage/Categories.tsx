'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Style from './categories.module.css';
import { getCategories, createCategory, deleteCategory } from '@/services/apiCategories';

export default function Categories() {
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();

                if (Array.isArray(data.categories)) { 
                    setCategories(data.categories);
                } else {
                    setCategories([]); 
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setCategories([]); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory) return;

        try {
            const category = await createCategory({ name: newCategory });
            setCategories([...categories, category.category]); 
            setNewCategory('');
        } catch (error) {
            console.error("Failed to create category:", error);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await deleteCategory(id);
            setCategories(categories.filter(category => category._id !== id));
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    return (
        <div className={Style.categoriesPage}>
            <div className={Style.addCategory}>
                <form onSubmit={handleCreateCategory}>
                    <div className={Style.inputGroup}>
                        <label htmlFor="categoryName">Name</label>
                        <input
                            type="text"
                            id="categoryName"
                            value={newCategory}
                            required
                            placeholder='Create a category...'
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                    </div>
                    <button type="submit">Create</button>
                </form>
            </div>
            <div className={Style.allCategories}>
                {isLoading ? (
                    <p>Loading...</p>
                ) : categories.length > 0 ? (
                    categories.map((category) => (
                        <div key={category._id} className={Style.categoryBox}>
                            <h3>{category.name || "Unnamed Category"}</h3>
                            <button onClick={() => handleDeleteCategory(category._id)}><FaTimes /></button>
                        </div>
                    ))
                ) : (
                    <p>No categories created</p>
                )}
            </div>
        </div>
    );
}
