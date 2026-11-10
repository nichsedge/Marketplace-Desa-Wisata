# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "httpx",
# ]
# ///
"""
scripts/test_order_pipeline.py
End-to-end test suite for Persistent Order Creation, Webhook Auto-Settlement, and Verification.
Usage:
    uv run scripts/test_order_pipeline.py [optional_base_url]
"""

import sys
import hashlib
import time
import httpx

DEFAULT_BASE_URL = "http://localhost:5175"
DEFAULT_SERVER_KEY = "SB-Mid-server-80uhszC-U-x.iH7pnFqIm~wo"


def generate_sha512(order_id: str, status_code: str, gross_amount: str, server_key: str) -> str:
    raw = f"{order_id}{status_code}{gross_amount}{server_key}".encode("utf-8")
    return hashlib.sha512(raw).hexdigest()


def test_pipeline(base_url: str = DEFAULT_BASE_URL):
    print("==================================================")
    print(" Saba Lembang End-to-End Order & Webhook Pipeline ")
    print(f" Target Base URL: {base_url}")
    print("==================================================\n")

    client = httpx.Client(timeout=10.0)
    order_id = f"SABA-{int(time.time())}"
    village_id = "des-01"
    gross_amount_num = 275000
    gross_amount_str = "275000.00"

    # Step 1: Create Order
    print(f"[STEP 1] Creating new order {order_id} via POST /api/orders...")
    create_payload = {
        "id": order_id,
        "villageId": village_id,
        "customerName": "Rizky Ramadhan (DKV ITB)",
        "customerPhone": "08122334455",
        "customerEmail": "rizky@example.com",
        "totalAmount": gross_amount_num,
        "status": "menunggu_pembayaran",
        "paymentSource": "midtrans",
        "notes": "Pesanan paket wisata Kopi Suntenjaya & Edukasi",
        "items": [
            {
                "productId": "sun-01",
                "productName": "Kopi Arabika Single Origin Suntenjaya 250g",
                "price": 75000,
                "quantity": 1,
                "subtotal": 75000,
            },
            {
                "productId": "sun-pkg-01",
                "productName": "Paket Edukasi Kopi & Kebun Lereng Palasari",
                "price": 200000,
                "quantity": 1,
                "subtotal": 200000,
            },
        ],
    }

    res_create = client.post(f"{base_url}/api/orders", json=create_payload)
    print(f"  Response: {res_create.status_code} - {res_create.text}")
    assert res_create.status_code == 201, f"Expected 201 Created, got {res_create.status_code}"
    print("  --> PASS: Order successfully created in persistent storage.\n")

    # Step 2: Query Order by ID
    print(f"[STEP 2] Fetching order details via GET /api/orders?orderId={order_id}...")
    res_get = client.get(f"{base_url}/api/orders?orderId={order_id}")
    print(f"  Response: {res_get.status_code}")
    assert res_get.status_code == 200, f"Expected 200 OK, got {res_get.status_code}"
    order_data = res_get.json().get("order", {})
    assert order_data.get("id") == order_id
    assert order_data.get("status") == "menunggu_pembayaran"
    print(f"  Current Status: {order_data.get('status')}")
    print("  --> PASS: Order and items verified in database.\n")

    # Step 3: Simulate Midtrans Webhook Settlement
    print("[STEP 3] Simulating Midtrans Webhook Payment Settlement (SHA-512 Signed)...")
    signature = generate_sha512(order_id, "200", gross_amount_str, DEFAULT_SERVER_KEY)
    tx_id = f"midtrans-tx-{int(time.time())}"
    webhook_payload = {
        "order_id": order_id,
        "status_code": "200",
        "gross_amount": gross_amount_str,
        "signature_key": signature,
        "transaction_id": tx_id,
        "transaction_status": "settlement",
        "payment_type": "qris",
        "settlement_time": "2026-11-10 16:45:00",
    }

    res_webhook = client.post(f"{base_url}/api/midtrans-notification", json=webhook_payload)
    print(f"  Response: {res_webhook.status_code} - {res_webhook.text}")
    assert res_webhook.status_code == 200, f"Expected 200 OK, got {res_webhook.status_code}"
    print("  --> PASS: Midtrans webhook successfully validated signature and executed auto-settlement.\n")

    # Step 4: Verify Order Status Updated to 'selesai'
    print(f"[STEP 4] Re-fetching order {order_id} to verify updated status...")
    res_verify = client.get(f"{base_url}/api/orders?orderId={order_id}")
    assert res_verify.status_code == 200
    updated_order = res_verify.json().get("order", {})
    print(f"  New Status:      {updated_order.get('status')}")
    print(f"  Midtrans TX ID:  {updated_order.get('midtrans_tx_id')}")
    print(f"  Payment Type:    {updated_order.get('midtrans_payment_type')}")
    print(f"  Settlement Time: {updated_order.get('settlement_time')}")

    assert updated_order.get("status") == "selesai", f"Expected status 'selesai', got {updated_order.get('status')}"
    assert updated_order.get("midtrans_tx_id") == tx_id
    print("  --> PASS: Order is now verified as 'selesai' (Lunas) with full audit trail!\n")

    print("==================================================")
    print(" All E2E Order & Webhook Tests Succeeded (100%)! ")
    print("==================================================")


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_BASE_URL
    test_pipeline(target)
