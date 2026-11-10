// src/utils/availability.ts
// Real-time Availability & Overbooking Guard for Saba Lembang Homestays & Tour Packages
import type { Order } from '../types';

export interface BookedDateRange {
  orderId: string;
  startDate: string;
  endDate: string;
  customerName: string;
}

export interface AvailabilityCheckResult {
  hasConflict: boolean;
  conflictingRange?: BookedDateRange;
  bookedRanges: BookedDateRange[];
  statusText: string;
}

/**
 * Extracts all booked date ranges for a specific product from confirmed/settled orders
 */
export function getProductBookedDateRanges(
  productId: string,
  orders: Order[]
): BookedDateRange[] {
  const activeOrders = orders.filter(
    (o) => o.status === 'selesai' || o.status === 'diproses'
  );

  const ranges: BookedDateRange[] = [];

  for (const order of activeOrders) {
    for (const item of order.items || []) {
      if (item.product?.id === productId) {
        const startDate = item.bookingDateStart;
        const endDate = item.bookingDateEnd || item.bookingDateStart;

        if (startDate && endDate) {
          ranges.push({
            orderId: order.id,
            startDate,
            endDate,
            customerName: order.customerName,
          });
        }
      }
    }
  }

  return ranges;
}

/**
 * Checks if two date intervals [startA, endA] and [startB, endB] overlap
 * Overlap condition: startA < endB && endA > startB
 */
export function doDatesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();

  if (isNaN(sA) || isNaN(eA) || isNaN(sB) || isNaN(eB)) {
    return false;
  }

  // Same day or overlapping range
  return sA <= eB && eA >= sB;
}

/**
 * Validates whether the user's selected date range conflicts with existing bookings
 */
export function checkBookingConflict(
  productId: string,
  requestedStart?: string,
  requestedEnd?: string,
  orders: Order[] = []
): AvailabilityCheckResult {
  const bookedRanges = getProductBookedDateRanges(productId, orders);

  if (!requestedStart) {
    return {
      hasConflict: false,
      bookedRanges,
      statusText: 'Tanggal belum dipilih',
    };
  }

  const effectiveEnd = requestedEnd || requestedStart;

  for (const range of bookedRanges) {
    if (doDatesOverlap(requestedStart, effectiveEnd, range.startDate, range.endDate)) {
      return {
        hasConflict: true,
        conflictingRange: range,
        bookedRanges,
        statusText: `Tanggal ini sudah dipesan (${range.startDate} s.d ${range.endDate})`,
      };
    }
  }

  return {
    hasConflict: false,
    bookedRanges,
    statusText: 'Tanggal tersedia (Siap dipesan)',
  };
}
