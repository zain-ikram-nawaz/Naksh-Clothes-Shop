import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: [200, 'Name cannot be more than 200 characters'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot be more than 500 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative'],
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category'],
  },

  productType: {
    type: String,
    enum: ['polo', 'half-sleeve', 'full-sleeve', 'v-neck', 'round-neck', 'henley', 'tank-top'],
    required: [true, 'Please select a product type'],
  },

  sizes: [{
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
  }],

  colors: [{
    name: {
      type: String,
      required: true,
    },
    hexCode: {
      type: String,
      required: true,
    },
    images: [{
      url: String,
      publicId: String,
    }],
  }],

  images: [{
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    alt: String,
  }],

  material: {
    type: String,
    required: [true, 'Please specify the material'],
    default: '100% Cotton',
  },
  fabricType: {
    type: String,
    enum: ['cotton', 'polyester', 'blend', 'linen', 'silk', 'other'],
    default: 'cotton',
  },
  gsm: {
    type: Number,
    min: [100, 'GSM should be at least 100'],
    max: [300, 'GSM should not exceed 300'],
  },
  careInstructions: {
    type: [String],
    default: ['Machine wash cold', 'Do not bleach', 'Tumble dry low', 'Iron on low heat'],
  },

  fit: {
    type: String,
    enum: ['slim', 'regular', 'loose', 'oversized', 'athletic'],
    default: 'regular',
  },
  neckline: {
    type: String,
    enum: ['round', 'v-neck', 'polo', 'henley', 'crew'],
  },
  sleeveLength: {
    type: String,
    enum: ['short', 'long', 'sleeveless', '3/4'],
  },
  pattern: {
    type: String,
    enum: ['solid', 'striped', 'printed', 'checkered', 'graphic', 'plain'],
    default: 'solid',
  },

  brand: {
    type: String,
    default: 'Vankea',
  },
  madeIn: {
    type: String,
    default: 'India',
  },

  features: [{
    type: String,
  }],

  metaTitle: String,
  metaDescription: String,
  keywords: [String],

  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'active',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  trending: {
    type: Boolean,
    default: false,
  },

  onSale: {
    type: Boolean,
    default: false,
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
  },

  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
  },
  numReviews: {
    type: Number,
    default: 0,
  },

  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  barcode: String,

  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'kg'],
      default: 'g',
    },
  },
}, {
  timestamps: true  // Ye automatically createdAt aur updatedAt manage karega
});

// Create indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ slug: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);