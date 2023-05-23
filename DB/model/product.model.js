import mongoose, { Schema, model, Types } from "mongoose";
import slugify from "slugify";

export const size = ["xs", "s", "m", "l", "xl", "xxl"];
export const color = [
  "green",
  "blue",
  "red",
  "yellow",
  "black",
  "white",
  "brown",
];
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 20,
    },
    description: String,
    images: [
      {
        _id: false,
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    defaultImage: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    availableItems: {
      type: Number,
      min: 1,
      required: true,
    },
    soldItems: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      min: 1,
      required: true,
    },
    discount: {
      type: Number,
      min: 1,
      max: 100,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
    },
    subcategory: {
      type: Types.ObjectId,
      ref: "Subcategory",
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
    },
    cloudFolder: { type: String, unique: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // add id field to the json object
    toObject: { virtuals: true },
  }
);

// slug
productSchema.virtual("slug").get(function () {
  if (this.name) {
    return slugify(this.name, "-");
  }
});

//priceAfterDiscount
productSchema.virtual("finalPrice").get(function () {
  if (this.price) {
    return Number.parseFloat(
      this.price - (this.price * this.discount || 0) / 100
    ).toFixed(2);
  }
});

//check if product in stock
productSchema.methods.inStock = function (requiredQuantity) {
  // requiredQuantity by user
  return this.availableItems >= requiredQuantity ? true : false; // this >>> document >> product
};

// Query helpers
productSchema.query.paginate = async function (page, size) {
  const totalSize = await Product.count({}); //40

  page = !page || page < 1 ? 1 : page;

  const limit = !size || size < 1 || size > 10 ? 10 : size; // Front end
  const calculatedSkip = limit * (page - 1); // 10 * (20 - 1) = 10 * 19 = 190
  const skip = calculatedSkip > totalSize ? 0 : calculatedSkip;

  return this.skip(skip).limit(limit);
};

productSchema.query.filter = function (reqQuery) {
  const queryParams = JSON.parse(JSON.stringify(reqQuery).toLowerCase());
  // queryParams >> {name: "OPPO", price: 1000}
  const modelKeys = Object.keys(Product.schema.paths).map((key) =>
    key.toLowerCase()
  );
  // modelKeys >> ['name', 'price', 'discount', 'description', 'soldItems']
  const queryKeys = Object.keys(reqQuery).map((key) => key.toLowerCase());
  // querykeys >> ['name', 'price', 'fish']

  const matchedkeys = queryKeys.filter((key) => modelKeys.includes(key));

  // matchedkeys >> ['name', 'price']

  const filter = {};
  if (matchedkeys.length > 0)
    matchedkeys.forEach((key) => {
      filter[key] = queryParams[key];
    });
  // filter = {name: "OPPO", price: 1000}
  return this.find(filter); // find({})
};

productSchema.query.customSelect = function (reqQueryFields) {
  if (reqQueryFields) {
    const modelKeys = Object.keys(Product.schema.paths).map((key) =>
      key.toLowerCase()
    );

    const queryKeys = reqQueryFields.toLocaleLowerCase().split(" ");
    const filterkeys = queryKeys.filter((key) => modelKeys.includes(key));

    if (filterkeys.length < 1) {
      reqQueryFields = {};
    }
  }
  return this.select(reqQueryFields);
};

export const Product =
  mongoose.models.Product || model("Product", productSchema);
