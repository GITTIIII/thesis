function importAll(r: __WebpackModuleApi.RequireContext) {
  const images: { [key: string]: string } = {};
  r.keys().forEach((item: string) => {
    images[item.replace(/.\//, "").replace(/\.(png|jpe?g|svg)$/g, "")] =
      JSON.parse(JSON.stringify(r(item)));
  });
  return images;
}

const images = importAll(require.context("./", false, /\.(png|jpe?g|svg)$/));
export default images;

// import Img from "./images";
// <img src={Img['book.png']} />
