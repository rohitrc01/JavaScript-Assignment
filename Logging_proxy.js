/* Using Proxy, create a script that logs every property accessed or executed at a given instance in a function,
without adding logs to individual properties.The logging should automatically apply to any new properties added
later without adding additional lines of code. */


// 1: Creating a proxy wrapper that logs property operations with timestamps
function createLoggedInstance(instanceName, target) {
  return new Proxy(target, {
    get(obj, prop) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${instanceName}.${String(prop)}`);
      return obj[prop];
    },

    set(obj, prop, value) {
      const timestamp = new Date().toISOString();
      console.log(
        `[${timestamp}] ${instanceName}.${String(prop)} = ${JSON.stringify(value)}`
      );
      obj[prop] = value;
      return true;
    },

    deleteProperty(obj, prop) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [DEL] ${instanceName}.${String(prop)}`);
      delete obj[prop];
      return true;
    }
  });
}

// 2: Object with initial values
const Proxyuser = createLoggedInstance("Proxyuser", {
  username: "rohit",
  role: "admin",
  isActive: true
});

// 3: Access properties
console.log(Proxyuser.username);
console.log(Proxyuser.role);

// 4: Update existing property
Proxyuser.isActive = false;

// 5: Delete a property
delete Proxyuser.role;


/* [2026-02-09T04:15:24.897Z] Proxyuser.username
rohit
[2026-02-09T04:15:24.908Z] Proxyuser.role
admin
[2026-02-09T04:15:24.909Z] Proxyuser.isActive = false
[2026-02-09T04:15:24.909Z] [DEL] Proxyuser.role */
