const {sequelize, Badge} = require('../db')

const badges = {'1_star': '1 animal found and confirmed', '5_star': "5 animals found and confirmed", 
    '25_star': "25 animals found and confirmed"}

async function name() {
    await sequelize.authenticate()

await Promise.all( // expects an array of promises (sequelize)
  Object.entries(badges).map(([key, val]) =>
    Badge.create({ name: key, description: val, picture: `/badges/${key}.png`})
  )
);
}
name()
