const {sequelize, Animal} = require('../db')
const fs = require('fs')
const path = require('path')
const animal_json = require('../../../ML/animals.json');
const animal_desc = require('./animal_desc.json')

async function make_animals(){
    await sequelize.authenticate()
    const keys = Object.keys(animal_json) //converts the srting into an object 
    for (const key of keys){
       if (!(key in animal_desc)){
        animal_desc[key] = ""
       } 
       const animal = await Animal.findOne({where: {name: key}})
       if (!animal){
            await Animal.create({name: key, description: animal_desc[key], picture: `/animal_icons/${key}_icon.png`})
       }
       else{
         animal.description = animal_desc[key]
         animal.picture = `/animal_icons/${key}_icon.png`
         await animal.save()
       }

       
        
        
    }
    fs.writeFileSync(path.join(__dirname, './animal_desc.json'), 
    JSON.stringify(animal_desc, null, 2), 'utf8');

}

make_animals()