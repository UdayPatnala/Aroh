const { AIOrchestrator, validateAIRequest } = require("../packages/asdk");

console.log("=================================================");
console.log(" AROH AI Provider Abstraction Integration Test   ");
console.log("=================================================");

async function runTest() {
  try {
    const orchestrator = new AIOrchestrator();

    const requestPayload = {
      messages: [
        { role: "system", content: "You are the AROH AI Orchestrator." },
        { role: "user", content: "Test ecosystem intelligence reasoning." }
      ],
      provider: "mock",
      temperature: 0.5
    };

    console.log("\n1. Validating AI Request Payload Schema...");
    const validated = validateAIRequest(requestPayload);
    console.log("   ✓ Request Payload Validated Successfully");

    console.log("\n2. Executing Completion via AIOrchestrator...");
    const response = await orchestrator.complete(validated);

    console.log(`   ✓ Provider: ${response.provider}`);
    console.log(`   ✓ Model: ${response.model}`);
    console.log(`   ✓ Content: ${response.content}`);
    console.log(`   ✓ Usage: ${response.usage.totalTokens} tokens, $${response.usage.estimatedCostUsd} estimated cost`);

    console.log("\n=================================================");
    console.log(" Summary: AI Provider Abstraction Integration Test PASSED");
    console.log("=================================================");
  } catch (err) {
    console.error("❌ AI Abstraction Test Failed:", err);
    process.exit(1);
  }
}

runTest();
