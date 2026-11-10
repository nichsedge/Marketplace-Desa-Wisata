# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""
scripts/test_availability.py
Verification suite for Real-Time Availability & Overbooking Guard logic.
Usage:
    uv run scripts/test_availability.py
"""

from datetime import datetime


def do_dates_overlap(start_a: str, end_a: str, start_b: str, end_b: str) -> bool:
    fmt = "%Y-%m-%d"
    s_a = datetime.strptime(start_a, fmt)
    e_a = datetime.strptime(end_a, fmt)
    s_b = datetime.strptime(start_b, fmt)
    e_b = datetime.strptime(end_b, fmt)

    return s_a <= e_b and e_a >= s_b


def run_tests():
    print("==================================================")
    print(" Saba Lembang Availability & Overbooking Guard   ")
    print("==================================================\n")

    # Seed booking: Homestay Teras Kayu (2026-11-20 s/d 2026-11-22)
    booked_start = "2026-11-20"
    booked_end = "2026-11-22"

    print(f"Active Confirmed Booking: {booked_start} to {booked_end}\n")

    # Case 1: Overlapping inside
    req1_start, req1_end = "2026-11-21", "2026-11-23"
    overlap1 = do_dates_overlap(req1_start, req1_end, booked_start, booked_end)
    print(f"[TEST 1] Request {req1_start} s/d {req1_end} -> Conflict: {overlap1}")
    assert overlap1 is True, "Expected conflict!"
    print("  --> PASS: Overlapping partial range detected.\n")

    # Case 2: Completely covering
    req2_start, req2_end = "2026-11-18", "2026-11-25"
    overlap2 = do_dates_overlap(req2_start, req2_end, booked_start, booked_end)
    print(f"[TEST 2] Request {req2_start} s/d {req2_end} -> Conflict: {overlap2}")
    assert overlap2 is True, "Expected conflict!"
    print("  --> PASS: Enclosing range detected.\n")

    # Case 3: After existing booking (Safe)
    req3_start, req3_end = "2026-11-23", "2026-11-25"
    overlap3 = do_dates_overlap(req3_start, req3_end, booked_start, booked_end)
    print(f"[TEST 3] Request {req3_start} s/d {req3_end} -> Conflict: {overlap3}")
    assert overlap3 is False, "Expected no conflict!"
    print("  --> PASS: Subsequent non-overlapping slot allowed.\n")

    # Case 4: Before existing booking (Safe)
    req4_start, req4_end = "2026-11-15", "2026-11-19"
    overlap4 = do_dates_overlap(req4_start, req4_end, booked_start, booked_end)
    print(f"[TEST 4] Request {req4_start} s/d {req4_end} -> Conflict: {overlap4}")
    assert overlap4 is False, "Expected no conflict!"
    print("  --> PASS: Preceding non-overlapping slot allowed.\n")

    print("==================================================")
    print(" All Availability & Overbooking Tests Succeeded!  ")
    print("==================================================")


if __name__ == "__main__":
    run_tests()
