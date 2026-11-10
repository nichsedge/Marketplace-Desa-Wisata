# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "httpx",
# ]
# ///
"""
scripts/test_webhook.py
CLI test utility to simulate and verify Midtrans Webhook Notifications with SHA-512 signatures.
Usage:
    uv run scripts/test_webhook.py [optional_webhook_url]
"""

import sys
import hashlib
import time
import httpx

DEFAULT_URL = "http://localhost:5175/api/midtrans-notification"
DEFAULT_SERVER_KEY = "SB-Mid-server-80uhszC-U-x.iH7pnFqIm~wo"


def generate_sha512(order_id: str, status_code: str, gross_amount: str, server_key: str) -> str:
    raw = f"{order_id}{status_code}{gross_amount}{server_key}".encode("utf-8")
    return hashlib.sha512(raw).hexdigest()


def run_tests(url: str, server_key: str = DEFAULT_SERVER_KEY):
    print(f"==================================================")
    print(f" Midtrans Webhook Notification Engine Test")
    print(f" Target Endpoint: {url}")
    print(f" Server Key:      {server_key[:12]}...")
    print(f"==================================================\n")

    client = httpx.Client(timeout=10.0)

    # Test 1: Valid settlement notification
    order_id = f"SABA-{int(time.time())}"
    status_code = "200"
    gross_amount = "275000.00"
    valid_signature = generate_sha512(order_id, status_code, gross_amount, server_key)

    payload_valid = {
        "order_id": order_id,
        "status_code": status_code,
        "gross_amount": gross_amount,
        "signature_key": valid_signature,
        "transaction_id": f"tx-demo-{int(time.time())}",
        "transaction_status": "settlement",
        "payment_type": "qris",
        "fraud_status": "accept",
        "settlement_time": "2026-11-10 16:30:00",
    }

    print("[TEST 1] Sending Valid Settlement Webhook (Legitimate Midtrans Payload)...")
    try:
        res = client.post(url, json=payload_valid)
        print(f"  HTTP Status: {res.status_code}")
        print(f"  Response Body: {res.text}")
        assert res.status_code == 200, f"Expected 200 OK, got {res.status_code}"
        assert res.json().get("status") == "OK"
        print("  --> PASS: Valid signature correctly verified and processed.\n")
    except Exception as e:
        print(f"  --> FAIL Test 1: {e}\n")

    # Test 2: Spoofed / Tampered Signature (Security attack simulation)
    print("[TEST 2] Sending Spoofed Webhook (Tampered Signature attack)...")
    payload_tampered = dict(payload_valid)
    payload_tampered["signature_key"] = "0000000000000000000000000000000000000000000000000000000000000000"

    try:
        res = client.post(url, json=payload_tampered)
        print(f"  HTTP Status: {res.status_code}")
        print(f"  Response Body: {res.text}")
        assert res.status_code == 403, f"Expected 403 Forbidden, got {res.status_code}"
        print("  --> PASS: Tampered signature correctly rejected with 403 Forbidden.\n")
    except Exception as e:
        print(f"  --> FAIL Test 2: {e}\n")

    # Test 3: Expired / Cancelled Transaction
    order_id_expire = f"SABA-{int(time.time())}-EXP"
    valid_signature_exp = generate_sha512(order_id_expire, status_code, gross_amount, server_key)
    payload_expire = {
        "order_id": order_id_expire,
        "status_code": status_code,
        "gross_amount": gross_amount,
        "signature_key": valid_signature_exp,
        "transaction_id": f"tx-exp-{int(time.time())}",
        "transaction_status": "expire",
        "payment_type": "bank_transfer",
    }

    print("[TEST 3] Sending Expired Webhook Notification...")
    try:
        res = client.post(url, json=payload_expire)
        print(f"  HTTP Status: {res.status_code}")
        print(f"  Response Body: {res.text}")
        assert res.status_code == 200
        print("  --> PASS: Expire status correctly received and resolved.\n")
    except Exception as e:
        print(f"  --> FAIL Test 3: {e}\n")

    print("==================================================")
    print(" All Webhook Verification Tests Completed!")
    print("==================================================")


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_URL
    run_tests(target)
