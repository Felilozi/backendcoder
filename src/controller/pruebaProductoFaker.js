'use strict'
import faker from 'faker'
export const generateMockProduct = (count) => {
    const mockProduct = [];
    for (let i = 0; i < count; i++) {

        const Product = {
            id:faker.database.mongodbObjectId(),
            title:faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price({min:1000,max:20000,dec:2}),
            thumbnails: faker.image.abstract(),
            code: faker.commerce.isbn({variant:8,separator:''}),
            stock: faker.random.numeric(2),
            status: true,
            category: faker.commerce.department(),
        }
        mockProduct.push(Product)

    }
    return mockProduct
};
