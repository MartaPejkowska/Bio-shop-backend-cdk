describe('importProductFile', ()=>{
    test('function should return signed Url', () => {

        const event = { pathParameters: { name: 'Product.csv' } };
        const callback = (err, response) => {
        expect(err).toBeNull();

        expect(response.statusCode).toEqual(200);;
        expect(response).toHaveProperty('headers');
        expect(response).toHaveProperty('body');
        expect(typeof response.body).toBe('string');

        const body = JSON.parse(response.body);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty('url');
    }
    }
    )
})