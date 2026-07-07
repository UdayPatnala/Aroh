// AROH Session Sync QA Integration Test

const Module = require("module");
const originalRequire = Module.prototype.require;

// Mock React before loading components to capture hooks
const React = require("react");
let capturedEffect = null;
React.useEffect = (effect) => {
  capturedEffect = effect;
};

// Retrieve the real store
const realStorePath = require.resolve("../packages/asdk/src/store/index.ts");
const realStore = originalRequire.apply(this, [realStorePath]);

// Create mock wrapper around usePlatformStore to avoid hook errors in Node.js
const usePlatformStoreMock = function (selector) {
  return selector(realStore.usePlatformStore.getState());
};
Object.defineProperties(usePlatformStoreMock, Object.getOwnPropertyDescriptors(realStore.usePlatformStore));

// Mock next/navigation and @aroh/asdk imports
global.routerPushed = null;
Module.prototype.require = function (id) {
  if (id === "next/navigation") {
    return {
      useRouter: () => ({
        push: (url) => {
          global.routerPushed = url;
        }
      })
    };
  }
  if (id === "@aroh/asdk") {
    return {
      usePlatformStore: usePlatformStoreMock
    };
  }
  return originalRequire.apply(this, arguments);
};

// Mock global window and localStorage
const localStorageStore = {};
const listeners = [];

global.window = {
  localStorage: {
    setItem: (key, value) => {
      localStorageStore[key] = String(value);
    },
    getItem: (key) => {
      return localStorageStore[key] || null;
    },
    removeItem: (key) => {
      delete localStorageStore[key];
    },
    clear: () => {
      for (const key of Object.keys(localStorageStore)) {
        delete localStorageStore[key];
      }
    }
  },
  addEventListener: (event, callback) => {
    if (event === "storage") {
      listeners.push(callback);
    }
  },
  removeEventListener: (event, callback) => {
    if (event === "storage") {
      const idx = listeners.indexOf(callback);
      if (idx !== -1) {
        listeners.splice(idx, 1);
      }
    }
  }
};

global.localStorage = global.window.localStorage;

// Load components
const SessionSyncModule = require("../apps/web/app/components/session-sync.tsx");
const SessionSync = SessionSyncModule.default;

// Assert helper
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log("=== Running AROH Session Sync QA Automation Tests ===");

  function resetStore(authenticated = true) {
    usePlatformStoreMock.setState({
      isAuthenticated: authenticated,
      user: authenticated ? { id: "user-123", email: "test@aroh.co" } : null,
      profile: authenticated ? { displayName: "Test User" } : null,
      wallet: authenticated ? { balance: 500 } : null,
      token: authenticated ? "mock-token-123" : null,
      transactions: authenticated ? [{ id: "tx-1" }] : [],
      notifications: authenticated ? [{ id: "n-1", message: "Hello", type: "info", read: false }] : [],
    });
    global.window.localStorage.clear();
    global.routerPushed = null;
  }

  // Test 1: Calling logout() (default) writes to localStorage key aroh_logout_event
  console.log("\n--- Test 1: default logout() writes to localStorage ---");
  resetStore(true);
  assert(usePlatformStoreMock.getState().isAuthenticated === true, "Pre-condition: store is authenticated");
  
  usePlatformStoreMock.getState().logout();
  
  assert(usePlatformStoreMock.getState().isAuthenticated === false, "Post-condition: store is not authenticated");
  assert(usePlatformStoreMock.getState().user === null, "Store state is cleared (user is null)");
  
  const logoutTimestamp = global.window.localStorage.getItem("aroh_logout_event");
  assert(logoutTimestamp !== null, "localStorage should contain 'aroh_logout_event'");
  assert(!isNaN(Number(logoutTimestamp)), "aroh_logout_event is a valid timestamp");

  // Test 2: Calling logout(true) updates store state but does NOT write to localStorage
  console.log("\n--- Test 2: logout(true) does NOT write to localStorage ---");
  resetStore(true);
  assert(usePlatformStoreMock.getState().isAuthenticated === true, "Pre-condition: store is authenticated");
  
  usePlatformStoreMock.getState().logout(true);
  
  assert(usePlatformStoreMock.getState().isAuthenticated === false, "Post-condition: store is not authenticated");
  const logoutTimestamp2 = global.window.localStorage.getItem("aroh_logout_event");
  assert(logoutTimestamp2 === null, "localStorage should NOT contain 'aroh_logout_event'");

  // Test 3: Simulating the storage event triggers the logout and clears the state
  console.log("\n--- Test 3: Simulating storage event triggers logout ---");
  resetStore(true);
  
  // Call the functional component to run hook setup and capture effect
  SessionSync();
  assert(capturedEffect !== null, "Component successfully registered the useEffect callback");
  
  // Execute the effect to register window listeners
  const cleanup = capturedEffect();
  assert(listeners.length === 1, "A storage event listener was successfully registered on window");
  
  // Simulate storage event on key 'aroh_logout_event'
  const event = {
    key: "aroh_logout_event",
    newValue: String(Date.now())
  };
  listeners[0](event);
  
  assert(usePlatformStoreMock.getState().isAuthenticated === false, "Store state is logged out after storage event");
  assert(usePlatformStoreMock.getState().user === null, "Store state is cleared (user is null)");
  assert(global.routerPushed === "/login", "Router redirected to /login");

  // Cleanup event listener
  if (cleanup) cleanup();
  assert(listeners.length === 0, "Cleanup function successfully removed the event listener");

  // Test 4: Simulating storage event when already logged out does nothing
  console.log("\n--- Test 4: Simulating storage event when already logged out does nothing ---");
  resetStore(false);
  
  SessionSync();
  const cleanup2 = capturedEffect();
  assert(listeners.length === 1, "Registered event listener for logged out state");
  
  listeners[0]({
    key: "aroh_logout_event",
    newValue: String(Date.now())
  });
  
  assert(global.routerPushed === null, "Router was NOT redirected because user was already logged out");
  if (cleanup2) cleanup2();

  console.log(`\n=== Session Sync QA Test Run Finished ===`);
  console.log(`Passed: ${passed} | Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
