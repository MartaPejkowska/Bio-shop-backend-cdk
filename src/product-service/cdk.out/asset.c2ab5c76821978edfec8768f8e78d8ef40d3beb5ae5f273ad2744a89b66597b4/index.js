var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// asset-input/src/product-service/lambdas/getProductsList.js
var getProductsList_exports = {};
__export(getProductsList_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(getProductsList_exports);

// asset-input/src/product-service/lambdas/productList.js
var products = [
  {
    "id": "1",
    "title": "Erythritol",
    "description": "Erythritol has a delicate, sweet taste (about 70-80% sweetness compared to beet sugar). Due to the low glycemic index it can be used regardless of the state of health or the medications taken.",
    "price": "12",
    "image": "https://enkioo.com/hpeciai/3d84231b0b17d55cfd5af51a6d25082c/pol_pm_Enkioo-Erytrytol-erytrol-naturalny-slodzik-substancja-slodzaca-1000-g-11_3.png",
    "packSize": "200g"
  },
  {
    "id": "2",
    "title": "Cocoa",
    "description": "Cocoa has a beneficial effect on the cardiovascular system. Helps regulate cholesterol and blood pressure.",
    "price": "10",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ew9uvCY7jFPazM0ik1eIMXgT5LusvjA-Sg&usqp=CAU",
    "packSize": "100g"
  },
  {
    "id": "3",
    "title": "Coconut oil",
    "description": "Coconut oil is considered by many to be the healthiest oil in the world. This product is used in the kitchen, cosmetics and natural medicine.",
    "price": "19",
    "image": "https://m.media-amazon.com/images/I/71HqNOCH32L.jpg",
    "packSize": "500g"
  },
  {
    "id": "4",
    "title": "Xylitol",
    "description": "Xylitol, commonly known as birch sugar, is an all-natural sweetener extracted from birch bark.",
    "price": "11",
    "image": "https://m.media-amazon.com/images/I/81iMQq1LxML.jpg",
    "packSize": "400g"
  },
  {
    "id": "5",
    "title": "Matcha",
    "description": "Matcha is powdered green tea. It is distinguished by a bittersweet taste and an intense green color.",
    "price": "22",
    "image": "https://zielonaesencja.pl/pol_pl_Matcha-zielona-herbata-100-g-proszek-6949_1.webp",
    "packSize": "200g"
  },
  {
    "id": "6",
    "title": "Turmeric",
    "description": "Turmeric gives dishes a unique flavor. In addition, it has anti-inflammatory and antiviral properties.",
    "price": "6",
    "image": "https://m.media-amazon.com/images/I/812sgSnc3aL.jpg",
    "packSize": "50g"
  },
  {
    "id": "7",
    "title": "Quinoa",
    "description": "Quinoa is a rich source of wholesome protein, healthy fatty acids, as well as many vitamins and minerals. It also has antioxidant properties and potential anti-cancer effects.",
    "price": "13",
    "image": "https://a.allegroimg.com/s1024/0cde76/5f1ff8614d069b3257d8b36a0484",
    "packSize": "100g"
  },
  {
    "id": "8",
    "title": "Nigella seeds",
    "description": "Nigella seeds are rich in minerals (selenium, zinc, calcium, magnesium, sodium, potassium, iron), fatty acids, proteins, carbohydrates and vitamins.",
    "price": "18",
    "image": "https://m.media-amazon.com/images/I/714xAS7NFlL._SL1500_.jpg",
    "packSize": "150g"
  },
  {
    "id": "9",
    "title": "Black seed oil",
    "description": "Black seed oil contains vitamin A and E. Black seed oil has antibacterial, anti-inflammatory and antispasmodic properties.",
    "price": "20",
    "image": "https://www.plantamed.pl/22144-large_default/black-seed-oil-olej-z-czarnuszki-125-ml-kiki-health.jpg",
    "packSize": "500ml"
  }
];

// asset-input/src/product-service/lambdas/responses.js
var responses = {
  _200(data = {}) {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*"
      },
      statusCode: 200,
      body: JSON.stringify(data)
    };
  },
  _400(data = {}) {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*"
      },
      statusCode: 400,
      body: JSON.stringify(data)
    };
  },
  _500(data = {}) {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*"
      },
      statusCode: 400,
      body: JSON.stringify(data)
    };
  }
};

// asset-input/src/product-service/lambdas/getProductsList.js
var handler = async () => {
  const result = await products;
  if (!result) {
    return responses._400({ message: "products not found" });
  }
  return responses._200(result);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
