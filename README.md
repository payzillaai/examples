# Payzilla examples

Small, client-side examples. No keys, no secrets, nothing from Payzilla's own servers.

| Folder | What | Cost |
|---|---|---|
| [agent](agent/search-and-quote.mjs) | An agent calls the MCP tools at `https://paywith.payzilla.ai/mcp`: lists the tools, searches the Marketplace, reads one listing and its payment terms | Free: nothing is signed or paid |
| [seller](seller/steps.md) | The steps to list a service and get paid | Your first real payment, at the price you set |

Run the agent example: `node agent/search-and-quote.mjs` (Node 18 or newer, no packages).

Paying is real money on Solana mainnet and cannot be undone. Limits: 1 USDC per payment, 20 USDC per day for the MCP service. Docs: https://github.com/payzillaai/docs
