exports.convertBase64ToBuffer = (base64) => {
  return new Promise((resolve) => {
    try {
      /// Proceso para pasar un base64 a un buffer
      const base64Replaced = base64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Replaced, 'base64');
      const type = base64.split(';')[0].split('/')[1];
      console.log('type', type)
      console.log('buffer', buffer);
      console.log(`ContentType:`, `image/${type}`);
      return resolve({
        buffer,
        type,
        contentType: `image/${type}`
      })
    } catch (error) {
      return resolve({error})
    }
  })

}
