//Parent Repository file

const fs = require('fs');
const crypto = require('crypto'); 

module.exports = class Repository {
	constructor(filename){
		if(!filename){															//filename is the name of the file where we would store the information.
			throw new Error('Creating a repository requires a filename');			
		}
		this.filename= filename;
		try{
			fs.accessSync(this.filename);							//To check if that file exists
		} catch(err){
			fs.writeFileSync(this.filename, '[]');					//Create a file if it doesnt exist. The file contains a string that has an emply array.
		}	
	}
	
	async getAll(){
		return JSON.parse(await fs.promises.readFile(this.filename, {encoding : 'utf8'}));						//JSON.parse() - To convert from a string to an object.
	}
	
	async create(attrs){
		attrs.id = this.randomId();
		const records = await this.getAll();
		records.push(attrs);
		await this.writeAll(records);
		return attrs;
	}
	
	async writeAll(records){
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}
	
	randomId(){
		return crypto.randomBytes(4).toString('hex');
	}
	
	async getOne(id){
		const records = await this.getAll();
		return records.find( record => record.id===id );
	}
	
	async delete(id){
		const records = await this.getAll();
		const filteredRecords= records.filter( record=> record.id!==id );
		await this.writeAll(filteredRecords);
	}
	
	async update(id, attrs){
		const records = await this.getAll();
		const record = records.find( record=> record.id===id );
		if(!record){ throw new error(`Record with id ${id} not found`) };
		Object.assign(record, attrs);							//Copy the properties in attrs to record.
		await this.writeAll(records);
	}
	
	async getOneBy(filters){
		const records = await this.getAll();
		for(let record of records){
			let found= true;
			for(let key in filters){
				if(record[key]!==filters[key]){
					found=false;
				}
			}
			if(found){
				return record;
			}
		}
	}
};