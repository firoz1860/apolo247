import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import LabTest from '@/lib/db/models/LabTest';
import { requireAuth } from '@/lib/auth/requireAuth';
import { catalogQuerySchema } from '@/lib/validation/commerce';

/** GET /api/lab-tests — list lab tests with search / category / paging. */
export async function GET(request: NextRequest) {
  try {
    const parsed = catalogQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams)
    );
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid query' },
        { status: 400 }
      );
    }
    const { search, category, page, limit } = parsed.data;

    await dbConnect();

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const [tests, total] = await Promise.all([
      LabTest.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      LabTest.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    return NextResponse.json({
      success: true,
      data: tests,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error listing lab tests:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/** POST /api/lab-tests — create a lab test (auth required). */
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    await dbConnect();
    const data = await request.json();
    const test = await LabTest.create(data);
    return NextResponse.json({ success: true, data: test }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lab test:', error);
    if (error?.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
