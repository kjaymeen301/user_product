'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Product.init({
        user_id: {
            type: DataTypes.INTEGER,
        },
        title: DataTypes.STRING,
        image: {
            type: DataTypes.STRING,
            get() {
                if (this.getDataValue('image')) {
                    const img_path = process.env.PRODUCT_PATH;
                    // 'this' allows you to access attributes of the instance
                    return process.env.APP_BASE_URL + img_path + this.getDataValue('image');
                } else {
                    return this.getDataValue('image');
                }
            },
        },
        price: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            comment: "1 active  0 deactive"
        },


    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};