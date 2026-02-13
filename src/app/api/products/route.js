import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// --- FIX: Build error ke liye ye line sabse zaroori hai ---
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();

    // URL parameters extract karna (Dynamic behavior)
    const { searchParams } = new URL(request.url);

    // Pagination logic
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    // Filters logic
    const category = searchParams.get('category');
    const productType = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const color = searchParams.get('color');
    const size = searchParams.get('size');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const trending = searchParams.get('trending');

    // Sort logic
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build query object
    let query = { status: 'active' };

    if (category) query.category = category;
    if (productType) query.productType = productType;
    if (color) query['colors.name'] = new RegExp(color, 'i');
    if (size) query['sizes.size'] = size;
    if (featured === 'true') query.featured = true;
    if (trending === 'true') query.trending = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
      ];
    }

    // Execute database query
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}