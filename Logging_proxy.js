// 1: Creating a proxy that logs property operations
function createLoggedInstance(instanceName, target) {
  return new Proxy(target, {
    get(obj, prop) {
      console.log(`[GET] ${instanceName}.${String(prop)}`);
      return obj[prop];
    },

    set(obj, prop, value) {
      console.log(
        `[SET] ${instanceName}.${String(prop)} = ${JSON.stringify(value)}`
      );
      obj[prop] = value;
      return true;
    },

    deleteProperty(obj, prop) {
      console.log(`[DELETE] ${instanceName}.${String(prop)}`);
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

// Step 3: Access properties
console.log(Proxyuser.username);
console.log(Proxyuser.role);

//4: Update existing property
Proxyuser.isActive = false;

// 5: Add new property 
Proxyuser.lastLogin = "2026-02-06";  // we can add currentDate() 

// 6: Delete a property
delete Proxyuser.role;

// 7: Access newly added property
console.log(Proxyuser.lastLogin);
