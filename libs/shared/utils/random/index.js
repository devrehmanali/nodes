const { faker } = require('@faker-js/faker');
const GenerateRandomEmail = () => {
  var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  var string = '';
  for (var ii = 0; ii < 15; ii++) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return string + '@brokers.com';
};
exports.GenerateRandomEmail = GenerateRandomEmail;
exports.UserRandomAccount = () => {
  return {
    email: GenerateRandomEmail(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  };
};
exports.GenerateRandomUuid = () => faker.datatype.uuid();
