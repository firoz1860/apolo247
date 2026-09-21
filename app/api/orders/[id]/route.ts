import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import Order from '@/lib/db/models/Order';
import { requireAuth } from '@/lib/auth/requireAuth';

/** GET /api/orders/:id — owner reads one order. */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    await dbConnect();
    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    if (order.user.toString() !== auth.userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/** PATCH /api/orders/:id — cancel an order (owner only). */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const body = await request.json().catch(() => null);
    if (!body || body.action !== 'cancel') {
      return NextResponse.json(
        { success: false, error: 'Only { "action": "cancel" } is supported' },
        { status: 400 }
      );
    }

    await dbConnect();
    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    if (order.user.toString() !== auth.userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    if (order.status !== 'placed') {
      return NextResponse.json(
        { success: false, error: `Cannot cancel a ${order.status} order` },
        { status: 409 }
      );
    }

    order.status = 'cancelled';
    await order.save();
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
