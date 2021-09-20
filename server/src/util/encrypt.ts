var crypto = require("crypto") as any;
var algorithm = "aes-128-cbc";
export const LENGTH_STRING_SMALL = 100;
export const LENGTH_STRING_MEDIUM = 550;
export const LENGTH_STRING_LONG = 1550;

export function encrypt(text: string, password: string) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

export function decrypt(text: string, password: string) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}
 
export function genKey(){
    var sharedSecret = crypto.randomBytes(16); // should be 128 (or 256) bits
    var initializationVector = crypto.randomBytes(16); // IV is always 16-bytes
    var privateKey = crypto.Cipheriv(
      algorithm,
      sharedSecret,
      initializationVector
    );
    return privateKey;
}