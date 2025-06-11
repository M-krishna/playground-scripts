// testing json stringify


const obj = {
    'a': 1,
    'b': 'krishna',
    'c': 1997,
}

obj.d = obj


function replaceFunc() {
      const visited = new WeakSet();
      return (key, value) => {
	      if (typeof value === "object" && value !== null) {
		        if (visited.has(value)) {
			            return;
			          }
		        visited.add(value);
		      }
	      return value;
	    }
}

console.log(JSON.stringify(obj, replaceFunc()));
