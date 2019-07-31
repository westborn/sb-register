export async function postData(url, obj) {
  const opts = {
    method: "post",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(obj)
  };
  try {
    const string = await fetch(url, opts);
    const res = await string.json();
    return { ok: true, data: res };
  } catch (error) {
    console.log("in postData-catch");
    console.log(error.stack);
    return { ok: false, error };
  }
}

export async function readFile(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function(evt) {
      console.log("Just read", file.name);
      resolve(evt.target.result);
    };
    reader.onerror = function(err) {
      console.error("Failed to read", file.name, "due to", err);
      reject(err);
    };
    reader.readAsDataURL(file);
  });
}
