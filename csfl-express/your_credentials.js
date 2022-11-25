/*
return credentials object and ensure it has been populated
**/
function getCredentials() {
  checkForPlaceholders();
  return credentials;
}

const user = 'test';
const password = '2A42jdLWT0Kungwj';

const credentials = {
  // Mongo Paths + URI
  MONGODB_URI: `mongodb+srv://${user}:${password}@vakinn.jczre.mongodb.net/?retryWrites=true&w=majority`,
  SHARED_LIB_PATH: `C:/crypt/bin/mongo_crypt_v1.dll`,
};

/*
  check if credentials object contains placeholder values
  **/
function checkForPlaceholders() {
  const errorBuffer = Array();
  const placeholderPattern = /^<.*>$/;
  for (const [key, value] of Object.entries(credentials)) {
    // check for placeholder text
    if (`${value}`.match(placeholderPattern)) {
      errorMessage = `You must fill out the ${key} field of your credentials object.`;
      errorBuffer.push(errorMessage);
    }
    // check if value is empty
    else if (value == undefined) {
      error_message = `The value for ${key} is empty. Please enter something for this value.`;
    }
  }
  // raise an error if errors in buffer
  if (errorBuffer.length > 0) {
    message = errorBuffer.join('\n');
    throw message;
  }
}

module.exports = { getCredentials };
