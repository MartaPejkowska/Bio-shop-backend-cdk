describe('getProductsList',()=>{
    test('function should return list of products', () => {
        const callback = (err, response) => {
          expect(err).toBeNull();

          expect(response).toHaveProperty('statusCode', 200);
          expect(response).toHaveProperty('body');
          expect(typeof response.body).toBe('string');

          const body = JSON.parse(response.body);
          expect(body).toBeInstanceOf(Object);
          expect(body).toHaveProperty('productId');
          expect(body).toHaveProperty('title');
          expect(body).toHaveProperty('description');
          expect(body).toHaveProperty('price');
          expect(body).toHaveProperty('image');
          expect(body).toHaveProperty('packSize');

          done();
        };
        });
})