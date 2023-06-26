describe('getProductsById', ()=>{
test('function should return 1 product by its id', () => {

    const event = { pathParameters: { id: '1' } };
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

test('if there is no id function should return: product not found', ()=>{
  const event = { pathParameters: { id: '' } };
    const callback = (err, response) => {
      expect(err).toBeNull();
      expect(response).toHaveProperty('statusCode', 400);
      expect(response).toHaveProperty('body');
      expect(typeof response.body).toBe('string');

      const body = JSON.parse(response.body);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', 'Product not found');
      done()

}});


test('if there is invalid id function should return: product not found', ()=>{
  const event = { pathParameters: { id: '12345' } };
    const callback = (err, response) => {
      expect(err).toBeNull();
      expect(response).toHaveProperty('statusCode', 400);
      expect(response).toHaveProperty('body');
      expect(typeof response.body).toBe('string');

      const body = JSON.parse(response.body);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', 'Product not found');
      done()

}})
})




