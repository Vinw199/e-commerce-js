//UsersRepository file

const fs = require('fs');
const crypto = require('crypto'); 
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

//This class is used to interact with the users repo. An instance of this will be exported.
class UsersRepository extends Repository {
	
	async create(attrs){
		    attrs.id = this.randomId();				//hash (password+salt). result is a buffer.Convert buffer to string.attrs: {email: 'fhfhd@vdvd.com', password: 'fhfhf'}

    const salt = crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buf.toString('hex')}.${salt}`
    };
    records.push(record);

    await this.writeAll(records);
	return record;	
	}
	
	async comparePasswords(saved, supplied){
		const [hashed, salt] = saved.split('.');
		const hashedSuppliedBuf = await scrypt(supplied, salt, 64);			//scrypt returns a buffer.
		return hashed===hashedSuppliedBuf.toString('hex');
	}
}

module.exports= new UsersRepository('users.json');
