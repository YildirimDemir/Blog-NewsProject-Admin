'use client';
import React, { useState, useEffect } from 'react';
import Style from './allusers.module.css';
import { getAllUsers } from '@/services/apiUsers'; 
import { IUser } from '@/models/userModel';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export default function AllUsers() {
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const fetchedUsers = await getAllUsers();
                const sortedUsers = fetchedUsers.sort((a, b) => a.userRole.localeCompare(b.userRole));
                setUsers(sortedUsers);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        }

        fetchUsers();
    }, []);

    return (
        <div className={Style.allUsersPage}>
            <h3>All Users</h3>
            <Link href='/users/create-user' className={Style.createUserLink}>Create User</Link>
            <div className={Style.allUsersTable}>
                <Table>
                    <TableCaption>All registered users</TableCaption>
                    <TableHeader>
                        <TableRow className={Style.tableRow}>
                            <TableHead className={Style.tableHead}>Username</TableHead>
                            <TableHead className={Style.tableHead}>Name</TableHead>
                            <TableHead className={Style.tableHead}>Email</TableHead>
                            <TableHead className={Style.tableHead}>Role</TableHead>
                            <TableHead className={Style.tableHead}>Posts</TableHead>
                            <TableHead className={Style.tableHead}>Likes</TableHead>
                            <TableHead className={Style.tableHead}>Comments</TableHead>
                            <TableHead className={Style.tableHead}>Manage</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id?.toString()} className={Style.tableRowItems}>
                                <TableCell className={Style.tableCell}>{user.username}</TableCell>
                                <TableCell className={Style.tableCell}>{user.name}</TableCell>
                                <TableCell className={Style.tableCell}>{user.email}</TableCell>
                                <TableCell className={Style.tableCell}>{user.userRole}</TableCell>
                                <TableCell className={Style.tableCell}>{user.posts?.length || 0}</TableCell>
                                <TableCell className={Style.tableCell}>{user.likes?.length || 0}</TableCell>
                                <TableCell className={Style.tableCell}>{user.comments?.length || 0}</TableCell>
                                <TableCell className={Style.tableCell}>
                                    <Link href={`/users/${user._id?.toString()}`}>
                                        Manage
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
