const images = require.context('./images', true);
export const imagePath = (name) => images(name, true);