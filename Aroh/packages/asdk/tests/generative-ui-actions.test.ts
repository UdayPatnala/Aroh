import { describe, it, expect, beforeEach } from "vitest";
import {
  generativeUIActionDispatcher,
  GenerativeUIActionRequestSchema,
  GenerativeUIActionResponseSchema
} from "../src";


describe("Generative UI Action Protocol & Dispatch Engine", () => {
  beforeEach(() => {
    generativeUIActionDispatcher.clear();
  });

  it("should validate and execute an aros transfer action with cryptographic receipt", () => {
    const rawReq = {
      actionId: "act-transfer-01",
      widgetType: "aros_transfer_preview",
      userId: "usr_adult_tester_99",
      actionType: "execute_aros_transfer",
      idempotencyKey: "idem_key_transfer_999",
      affirmativeAttestation: {
        purchaserIs18Attested: true,
        termsVersion: "1.0.0",
        policyVersion: "1.0.0"
      },
      payload: {
        recipient: "usr_developer_pro_42",
        amount: 250,
        currency: "Aros"
      }
    };

    const parsed = GenerativeUIActionRequestSchema.safeParse(rawReq);
    expect(parsed.success).toBe(true);

    const result = generativeUIActionDispatcher.executeAction(rawReq);
    expect(result.success).toBe(true);
    expect(result.status).toBe("SETTLED");
    expect(result.actionId).toBe("act-transfer-01");
    expect(result.receiptId).toBeDefined();
    expect(result.receiptId).toMatch(/^rcpt_[a-f0-9]{16}$/);
    expect(result.receiptHash).toBeDefined();
    expect(result.receiptHash?.length).toBe(64); // SHA-256 length
    expect(result.details?.settledVia).toBe("AROH_IMMUTABLE_LEDGER");

    const validatedResponse = GenerativeUIActionResponseSchema.safeParse(result);
    expect(validatedResponse.success).toBe(true);
  });

  it("should fail-closed and reject transfer if 18+ age attestation is false (D2 Financial Invariant)", () => {
    const minorReq = {
      actionId: "act-transfer-minor",
      widgetType: "aros_transfer_preview",
      userId: "usr_minor_account",
      actionType: "execute_aros_transfer",
      idempotencyKey: "idem_key_minor_block_1",
      affirmativeAttestation: {
        purchaserIs18Attested: false, // Underage / no affirmative adult consent
        termsVersion: "1.0.0",
        policyVersion: "1.0.0"
      },
      payload: {
        recipient: "usr_merchant",
        amount: 100,
        currency: "Aros"
      }
    };

    const result = generativeUIActionDispatcher.executeAction(minorReq);
    expect(result.success).toBe(false);
    expect(result.status).toBe("REJECTED");
    expect(result.message).toContain("NO_MINOR_PAYMENT_FOR_AROS");
    expect(result.receiptId).toBeUndefined();
  });

  it("should enforce idempotency and return cached receipt on replay", () => {
    const rawReq = {
      actionId: "act-idem-01",
      widgetType: "aros_transfer_preview",
      userId: "usr_adult_tester_99",
      actionType: "execute_aros_transfer",
      idempotencyKey: "idem_replay_test_key_abc",
      affirmativeAttestation: {
        purchaserIs18Attested: true,
        termsVersion: "1.0.0",
        policyVersion: "1.0.0"
      },
      payload: {
        recipient: "usr_merchant",
        amount: 50,
        currency: "Aros"
      }
    };

    const first = generativeUIActionDispatcher.executeAction(rawReq);
    const second = generativeUIActionDispatcher.executeAction(rawReq);

    expect(first.receiptId).toBe(second.receiptId);
    expect(first.receiptHash).toBe(second.receiptHash);
    expect(first.timestamp).toBe(second.timestamp);
  });

  it("should execute statutory consent gate confirmation and generate consent receipt", () => {
    const consentReq = {
      actionId: "act-consent-01",
      widgetType: "statutory_consent_gate",
      userId: "usr_adult_tester_99",
      actionType: "confirm_consent",
      idempotencyKey: "idem_consent_grant_101",
      affirmativeAttestation: {
        purchaserIs18Attested: true,
        termsVersion: "1.0.0",
        policyVersion: "2.05.04.0"
      },
      payload: {
        purpose: "Cross-Platform Session Continuity"
      }
    };

    const result = generativeUIActionDispatcher.executeAction(consentReq);
    expect(result.success).toBe(true);
    expect(result.status).toBe("SETTLED");
    expect(result.receiptId).toMatch(/^rcpt_consent_[a-f0-9]{14}$/);
    expect(result.message).toContain("DPDP Section 6");
  });
});
