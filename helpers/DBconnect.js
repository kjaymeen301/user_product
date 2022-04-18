const Sequelize = require('sequelize')
const UserModel = require('./../models/user')
const ProductModel = require('./../models/product')
const AdminModel = require('./../models/admin')

const sequelize = new Sequelize(process.env.db, process.env.user, process.env.password, {
    host: "127.0.0.1",

    dialect: 'mysql',
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

// sequelize.authenticate().then(function(errors) { console.log(errors) });

// don't Use this Script It Force create Table if table existing it will drop table first and Create again
// sequelize.sync({ force: false })
// .then(() => {
//  	// console.log(`Database & tables created!`)
//  })


const User = UserModel(sequelize, Sequelize)
const Product = ProductModel(sequelize, Sequelize)
const Admin = AdminModel(sequelize, Sequelize)



module.exports = {
    sequelize,
    User,
    Product,
    Admin
}