const { MongoClient, Binary } = require('mongodb');

const user = 'test';
const password = '2A42jdLWT0Kungwj';

const credentials = {
  // Mongo Paths + URI
  MONGODB_URI: `mongodb+srv://${user}:${password}@vakinn.jczre.mongodb.net/?retryWrites=true&w=majority`,
  SHARED_LIB_PATH: `C:/crypt/bin/mongo_crypt_v1.dll`,
};

// start-key-vault
const eDB = 'encryption';
const eKV = '__keyVault';
const keyVaultNamespace = `${eDB}.${eKV}`;
// end-key-vault

// start-kmsproviders
const fs = require('fs');
const provider = 'local';
const path = './master-key.txt';
// WARNING: Do not use a local key file in a production application
const localMasterKey = fs.readFileSync(path);
const kmsProviders = {
  local: {
    key: localMasterKey,
  },
};
// end-kmsproviders

const uri = credentials.MONGODB_URI;
const unencryptedClient = new MongoClient(uri);
await unencryptedClient.connect();
const keyVaultClient = unencryptedClient.db(eDB).collection(eKV);

const dek1 = await keyVaultClient.findOne({ keyAltNames: 'dataKey1' });
const dek2 = await keyVaultClient.findOne({ keyAltNames: 'dataKey2' });
const dek3 = await keyVaultClient.findOne({ keyAltNames: 'dataKey3' });
const dek4 = await keyVaultClient.findOne({ keyAltNames: 'dataKey4' });

const secretDB = 'encVakinnApp';
const secretCollection = 'patients';

// end-schema

// start-extra-options
const extraOptions = {
  cryptSharedLibPath: credentials['SHARED_LIB_PATH'],
};
// end-extra-options

// start-client
const encryptedClient = new MongoClient(uri, {
  autoEncryption: {
    keyVaultNamespace: keyVaultNamespace,
    kmsProviders: kmsProviders,
    extraOptions: extraOptions,
    encryptedFieldsMap: encryptedFieldsMap,
  },
});

await encryptedClient.connect();
// end-client

const unencryptedColl = unencryptedClient
  .db(secretDB)
  .collection(secretCollection);

// start-insert
const encryptedColl = encryptedClient.db(secretDB).collection(secretCollection);
await encryptedColl.insertOne({
  firstName: 'Jon',
  lastName: 'Doe',
  patientId: 12345678,
  address: '157 Electric Ave.',
  patientRecord: {
    ssn: '987-65-4320',
    billing: {
      type: 'Visa',
      number: '4111111111111111',
    },
  },
  medications: ['Atorvastatin', 'Levothyroxine'],
});
// end-insert
// start-find
console.log('Finding a document with regular (non-encrypted) client.');
console.log(await unencryptedColl.findOne({ firstName: /Jon/ }));
console.log(
  'Finding a document with encrypted client, searching on an encrypted field'
);
console.log(
  await encryptedColl.findOne({ 'patientRecord.ssn': '987-65-4320' })
);
// end-find
