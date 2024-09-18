import { NextRequest, NextResponse } from 'next/server';
import Category, { ICategory } from '@/models/categoryModel';
import { connectToDB } from '@/lib/mongodb';

export async function GET() {
    try {
        await connectToDB();

        const categories: ICategory[] = await Category.find();

        return NextResponse.json({ count: categories.length, categories }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching categories:', error.message);
            return NextResponse.json({ error: 'Failed to fetch categories', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ error: 'Failed to fetch categories', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}

export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ message: "Category name is required." }, { status: 400 });
        }

        await connectToDB();

        const newCategory = new Category({ name });
        await newCategory.save();

        return NextResponse.json({ message: "Category created successfully", category: newCategory }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating category:', error.message);
            return NextResponse.json({ message: 'Failed to create category', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ message: 'Failed to create category', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
