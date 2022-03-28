export const getTransformImages = (image: string) => {
  if (!image) return [];
  const imageName = image.substring(0, image.indexOf('.'));
  const imageExtantion = image.substring(image.indexOf('.'), image.length);

  return [
    image.replace(image, `${imageName}-transform${imageExtantion}`),
    image.replace(image, `${imageName}-binary${imageExtantion}`),
  ];
};
