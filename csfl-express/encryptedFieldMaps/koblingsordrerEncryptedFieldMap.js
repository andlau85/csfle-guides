export const koblingsordrerEncryptedFieldMap = {
  [`${'encVakinnApp'}.${'koblingsordrer'}`]: {
    fields: [
      {
        keyId: dek1._id,
        path: 'patientId',
        bsonType: 'int',
        queries: { queryType: 'equality' },
      },
      {
        keyId: dek2._id,
        path: 'medications',
        bsonType: 'array',
      },
      {
        keyId: dek3._id,
        path: 'patientRecord.ssn',
        bsonType: 'string',
        queries: { queryType: 'equality' },
      },
      {
        keyId: dek4._id,
        path: 'patientRecord.billing',
        bsonType: 'object',
      },
    ],
  },
};
