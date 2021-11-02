import faker from 'faker';

faker.locate='es';

export const fakeProds = () => ({
    title: faker.commerce.product(),
    price: faker.commerce.price(),
    thumbnail: faker.image.fashion(),
});