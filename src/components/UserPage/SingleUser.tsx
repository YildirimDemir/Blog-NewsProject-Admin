'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Style from './singleuser.module.css';
import { deleteUser } from '@/services/apiUsers';

export default function SingleUser() {
    const [user, setUser] = useState({
        username: '',
        name: '',
        email: '',
        userRole: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState('');
    const router = useRouter();
    const { userId } = useParams(); 

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/users/${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setSelectedRole(data.userRole); 
                } else {
                    console.error('Failed to fetch user');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(e.target.value);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/users/${userId}/userinfo`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    userRole: selectedRole,
                }),
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                alert('User role updated successfully!');
            } else {
                alert('Failed to update user role');
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const handleDelete = async () => {
        if (typeof userId === 'string') {
            try {
                await deleteUser(userId);
                alert('User deleted successfully!');
                router.push('/users'); 
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        } else {
            console.error('Invalid userId format');
        }
    };

    return (
        <div className={Style.singleUserPage}>
            <form onSubmit={handleUpdate}>
                <div className={Style.inputGroup}>
                    <label htmlFor="username">Username</label>
                    <input type="text" value={user.username} readOnly />
                </div>
                <div className={Style.inputGroup}>
                    <label htmlFor="name">Name</label>
                    <input type="text" value={user.name} readOnly />
                </div>
                <div className={Style.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input type="text" value={user.email} readOnly />
                </div>
                <div className={Style.inputGroup}>
                    <label htmlFor="userRole">User Role</label>
                    <select value={selectedRole} onChange={handleRoleChange}>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="member">Member</option>
                    </select>
                </div>
                <div className={Style.buttons}>
                    <button type="submit">Update</button>
                    <button type="button" onClick={handleDelete}>Delete</button>
                </div>
            </form>
        </div>
    );
}
