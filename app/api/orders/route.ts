import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import Product from '@/lib/db/models/Product';
import Order from '@/lib/db/models/Order';
import { requireAuth } from '@/lib/auth/requireAuth';
import { placeOrderSchema } from '@/lib/validation/commerce';

/** GET /api/orders — list the authenticated user's orders. */
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    await dbConnect();
    const orders = await Order.find({ user: auth.userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error listing orders:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/** POST /api/orders — place an order (mock payment). */
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const body = await request.json().catch(() => null);
    const parsed = placeOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    await dbConnect();

    const ids = parsed.data.items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids } }).lean<
      { _id: any; name: string; price: number }[]
    >();
    const byId = new Map(products.map((p) => [String(p._id), p]));

    // Build order items from server-side product data (never trust client prices).
    const items = [];
    let totalAmount = 0;
    for (const line of parsed.data.items) {
      const product = byId.get(line.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${line.productId} not found` },
          { status: 400 }
        );
      }
      items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: line.quantity,
      });
      totalAmount += product.price * line.quantity;
    }

    const order = await Order.create({
      user: auth.userId,
      items,
      totalAmount,
      status: 'placed',
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    console.error('Error placing order:', error);
    if (error?.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
