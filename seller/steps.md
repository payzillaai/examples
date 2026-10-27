# Seller steps: from sign-in to your first paid call

You need: a web service on an https address, and a Solana wallet you control. No code from Payzilla is needed to list; your server talks to the Payzilla API.

1. Open https://start.payzilla.ai and sign in with your email (you get a code).
2. Set your receiving wallet by signing a message. The first wallet is your main wallet and cannot be changed (up to 5 in all).
3. Add your service: a name, its web address and its price (set by you, per call).
4. Get your API key. Keep it in your server's environment; never in code, chat or logs.
5. Fund your receiving wallet once: send 0.01 USDC to it from another wallet, so it can receive USDC. Payments are refused until then.
6. In your server, for a call without payment: ask Payzilla for a payment with the service id and answer `402` with the challenge (in the body, and base64 in a `PAYMENT-REQUIRED` header).
7. When the buyer retries with a `PAYMENT-SIGNATURE` header: verify and settle it with Payzilla (`POST /verify`, `POST /settle`, header `x-api-key`). Serve the result only when `/settle` returns `success: true` with a transaction signature. On `settlement_pending`, answer 402 with `Retry-After`.
8. Optional: tick "List in the registry" (Marketplace, labelled Unverified) and "Allow a pay link" (a person can pay from a Payzilla page).

API reference: https://payzilla.ai/developers/ (base address `https://api-mainnet.payzilla.ai`).

How to test: list your service, then pay it once yourself from another wallet (real USDC; keep the price small) and check the transaction link on your Account page. There is no test key on mainnet: every payment is real.
