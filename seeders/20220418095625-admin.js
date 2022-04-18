'use strict';

const md5 = require("md5");

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */

        await queryInterface.bulkInsert('Admins', [{
            name: 'Admin',
            email: 'admin@admin.com',
            password: md5('123456'),
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }], {});


    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Admins', null, {});
    }
};