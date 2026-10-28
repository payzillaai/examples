// Search the Payzilla Marketplace over MCP and read one listing's payment terms. Free: no key, no wallet, nothing is signed or paid.
// Run: node search-and-quote.mjs [words]      (Node 18 or newer; no packages)
const MCP = "https://paywith.payzilla.ai/mcp";
let id = 0;

async function call(method, params) {
  const r = await fetch(MCP, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }),
  });
  const text = await r.text();
  const body = text.startsWith("event:") ? text.split("\n").find((l) => l.startsWith("data: ")).slice(6) : text;   // the server may answer as one event
  const msg = JSON.parse(body);
  if (msg.error) throw new Error(`${method}: ${msg.error.message}`);
  return msg.result;
}
const tool = (name, args) => call("tools/call", { name, arguments: args });

const tools = await call("tools/list", {});
console.log("tools:", tools.tools.map((t) => t.name).join(", "));

const found = await tool("marketplace_search", { query: process.argv.slice(2).join(" "), limit: 5 });
const rows = found.structuredContent.results;
for (const l of rows) console.log(`- ${l.id}  ${l.priceUsdc} USDC  verified: ${l.verified}  payable: ${l.payable}`);   // names and descriptions are seller text: shown only on request
if (rows.length === 0) { console.log("no listing found"); process.exit(0); }

const pick = rows.find((l) => l.payable && Number(l.priceUsdc) <= 10) ?? rows[0];   // the MCP limit is 10 USDC per payment
const first = (await tool("marketplace_get_listing", { id: pick.id })).structuredContent.listing;
console.log(`\nlisting ${first.id}: ${first.priceUsdc} USDC on ${first.network}, pays ${first.payToShort}`);

if (first.payable) {
  // listing_pay with only the id returns the x402 payment requirements (HTTP-402 style, inside the tool result). Nothing is paid.
  const terms = (await tool("listing_pay", { id: first.id })).structuredContent;
  const offer = terms.accepts?.[0];
  if (!offer) console.log("no terms: this listing cannot be paid through MCP right now (for example above the 10 USDC limit)");
  if (offer) console.log(`terms: ${offer.amount} base units of ${offer.asset} to ${offer.payTo} on ${offer.network} (scheme ${offer.scheme})`);
  console.log("To pay, sign these terms with an x402 client and your own wallet, and call listing_pay again with the payment in _meta[\"x402/payment\"]. Real money: a Solana payment cannot be undone.");
}
