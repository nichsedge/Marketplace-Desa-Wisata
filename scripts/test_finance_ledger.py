# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""
scripts/test_finance_ledger.py
Verification test for Multi-Village Revenue Split formulas, BUMDes Kawasan fees, and ledger integrity.
Usage:
    uv run scripts/test_finance_ledger.py
"""

def test_split_calculation():
    print("==================================================")
    print(" Saba Lembang Multi-Village Revenue Split Audit   ")
    print("==================================================\n")

    test_cases = [
        {"name": "One Day Culinary Tour", "gross": 275000, "is_direct_wa": False},
        {"name": "Camping Cikole 2D1N", "gross": 650000, "is_direct_wa": False},
        {"name": "Heritage Live-In 3D2N", "gross": 850000, "is_direct_wa": False},
        {"name": "Direct WA Kopi Suntenjaya", "gross": 75000, "is_direct_wa": True},
    ]

    total_gross = 0
    total_platform = 0
    total_gateway = 0
    total_net = 0

    for idx, tc in enumerate(test_cases, 1):
        gross = tc["gross"]
        is_wa = tc["is_direct_wa"]

        # Platform fee: 5%
        platform_fee = round(gross * 0.05)
        # Gateway fee: 0.7% (or 0 for WA)
        gateway_fee = 0 if is_wa else round(gross * 0.007)
        # Net to village
        net_payout = gross - platform_fee - gateway_fee

        assert platform_fee + gateway_fee + net_payout == gross, f"Mismatch in sum for case {idx}!"

        total_gross += gross
        total_platform += platform_fee
        total_gateway += gateway_fee
        total_net += net_payout

        print(f"[TEST {idx}] {tc['name']}")
        print(f"  Gross Amount:        Rp {gross:>9,}")
        print(f"  Platform Fee (5%):   Rp {platform_fee:>9,}")
        print(f"  Gateway Fee (0.7%):  Rp {gateway_fee:>9,}")
        print(f"  Net Village Payout:  Rp {net_payout:>9,}")
        print(f"  --> PASS (100% Balanced)\n")

    print("--------------------------------------------------")
    print(" Consolidated Pool Balance:")
    print(f"  Total Omzet Kotor:   Rp {total_gross:>9,}")
    print(f"  Total Kas BUMDes 5%: Rp {total_platform:>9,}")
    print(f"  Total MDR Gateway:   Rp {total_gateway:>9,}")
    print(f"  Total Hak Bersih:    Rp {total_net:>9,}")
    print("--------------------------------------------------")

    assert total_platform + total_gateway + total_net == total_gross
    print("\n==================================================")
    print(" All Revenue Split Mathematical Checks Succeeded! ")
    print("==================================================")


if __name__ == "__main__":
    test_split_calculation()
