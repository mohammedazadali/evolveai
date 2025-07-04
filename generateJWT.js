// import crypto from 'crypto'

// console.log(crypto.randomBytes(32).toString('hex'))


import bcrypt from 'bcryptjs';

const plainPassword = '123456';
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(plainPassword, salt);

console.log('Hashed password:', hashedPassword);
