const {sequelize, Team} = require('../db')

async function setTeam(){
    await sequelize.authenticate();

    Team.bulkCreate([
        {name: 'Fox'},
        {name: 'Bird'},
        {name: 'Dog'},
        {name: 'Cat'},
        {name: 'Raccon'},
        {name: 'Skunk'}
    
    ], { updateOnDuplicate: ['name'] })
}

setTeam()