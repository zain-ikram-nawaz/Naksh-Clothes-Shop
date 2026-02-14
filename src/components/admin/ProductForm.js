'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProductForm({ product = null, isEdit = false }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [activeTab, setActiveTab] = useState('core');

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    category: product?.category?._id || '',
    productType: product?.productType || 'half-sleeve',
    material: product?.material || '100% Cotton',
    fabricType: product?.fabricType || 'cotton',
    gsm: product?.gsm || '',
    fit: product?.fit || 'regular',
    neckline: product?.neckline || 'round',
    sleeveLength: product?.sleeveLength || 'short',
    pattern: product?.pattern || 'solid',
    brand: product?.brand || 'Naksh',
    madeIn: product?.madeIn || 'India',
    status: product?.status || 'active',
    featured: product?.featured || false,
    trending: product?.trending || false,
    onSale: product?.onSale || false,
    salePrice: product?.salePrice || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    images: product?.images || [],
    sizes: product?.sizes || [
      { size: 'S', stock: 0 },
      { size: 'M', stock: 0 },
      { size: 'L', stock: 0 },
      { size: 'XL', stock: 0 },
    ],
    colors: product?.colors || [],
    features: product?.features || [],
    careInstructions: product?.careInstructions || [
      'Machine wash cold',
      'Do not bleach',
      'Tumble dry low',
      'Iron on low heat',
    ],
    weight: product?.weight || { value: '', unit: 'g' },
    metaTitle: product?.metaTitle || '',
    metaDescription: product?.metaDescription || '',
    keywords: product?.keywords || [],
  });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) { console.error(error); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');

    // DATA CLEANING
    const submissionData = {
      ...formData,
      price: Number(formData.price),
      comparePrice: formData.comparePrice ? Number(formData.comparePrice) : 0,
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
      gsm: formData.gsm ? Number(formData.gsm) : undefined,
      category: typeof formData.category === 'object' ? formData.category._id : formData.category,
      productType: formData.productType || 'half-sleeve',
      weight: {
        value: formData.weight.value ? Number(formData.weight.value) : undefined,
        unit: formData.weight.unit || 'g',
      },
    };

    if (submissionData.images.length === 0) {
      alert("Please upload at least one image");
      setLoading(false);
      return;
    }

    const url = isEdit ? `/api/admin/products?id=${product._id}` : '/api/admin/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (data.success) {
        alert(isEdit ? 'Product updated!' : 'Product created!');
        router.push('/admin/products');
        router.refresh();
      } else {
        console.error("Server Error:", data.error);
        alert(`Error: ${data.message || 'Check fields'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  // --- IMAGE UPLOAD LOGIC ---
  // --- IMAGE UPLOAD LOGIC ---
// ProductForm.jsx mein handleImageUpload function update karein

const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  setUploadingImages(true);
  const formDataImages = new FormData();

  // Multiple images ko append karein
  files.forEach(file => {
    formDataImages.append('file', file);
  });

  try {
    const token = localStorage.getItem('token'); // Token get karein

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}` // Token add karein
      },
      body: formDataImages,
    });

    const data = await res.json();

    if (data.success) {
      // Single upload response handle karein
      const uploadedImage = {
        url: data.data.url,
        publicId: data.data.publicId,
        alt: formData.name || 'Product image'
      };

      // Form state update karein
      const newImages = [...formData.images, uploadedImage];
      setFormData(prev => ({ ...prev, images: newImages }));
    } else {
      alert(data.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Image upload failed');
  } finally {
    setUploadingImages(false);
  }
};


  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  // Color management functions
  const handleAddColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: '', hexCode: '#000000', images: [] }]
    });
  };

  const handleRemoveColor = (index) => {
    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData({ ...formData, colors: newColors });
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...formData.colors];
    newColors[index][field] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const tabs = [
    { id: 'core', label: 'Core Info', icon: '📋' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'specs', label: 'Specifications', icon: '📏' },
    { id: 'media', label: 'Media', icon: '🖼️' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
  ];

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">
              {isEdit ? 'Edit Product' : 'New Product'}
            </h1>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              formData.status === 'active' ? 'bg-green-100 text-green-700' :
              formData.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {formData.status}
            </span>
            {formData.onSale && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                On Sale
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex -mb-px space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Core Info Tab */}
        {activeTab === 'core' && (
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Classic Cotton T-Shirt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="Brief description for product cards"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.shortDescription.length}/500 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Detailed product description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="productType"
                      value={formData.productType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select type</option>
                      <option value="polo">Polo</option>
                      <option value="half-sleeve">Half Sleeve</option>
                      <option value="full-sleeve">Full Sleeve</option>
                      <option value="v-neck">V-Neck</option>
                      <option value="round-neck">Round Neck</option>
                      <option value="henley">Henley</option>
                      <option value="tank-top">Tank Top</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="Naksh"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Made In
                    </label>
                    <input
                      type="text"
                      name="madeIn"
                      value={formData.madeIn}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="India"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Visibility */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6">Status & Visibility</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-center gap-4 pt-7">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="trending"
                      checked={formData.trending}
                      onChange={handleChange}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">Trending</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6">Product Features</h2>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...formData.features];
                        newFeatures[index] = e.target.value;
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                      placeholder="e.g. Breathable fabric"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFeatures = formData.features.filter((_, i) => i !== index);
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      className="px-3 py-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      features: [...formData.features, '']
                    });
                  }}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  + Add Feature
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6">Pricing Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compare at Price (₹)
                  </label>
                  <input
                    type="number"
                    name="comparePrice"
                    value={formData.comparePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Original price for showing discounts
                  </p>
                </div>
              </div>
            </div>

            {/* Sale Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Sale Settings</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="onSale"
                    checked={formData.onSale}
                    onChange={handleChange}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-sm text-gray-700">Product on Sale</span>
                </label>
              </div>

              {formData.onSale && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            {/* Product Identifiers */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6">Product Identifiers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="SKU-12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="1234567890123"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specs' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6">Material & Construction</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="e.g. 100% Cotton"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fabric Type
                  </label>
                  <select
                    name="fabricType"
                    value={formData.fabricType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="cotton">Cotton</option>
                    <option value="polyester">Polyester</option>
                    <option value="blend">Blend</option>
                    <option value="linen">Linen</option>
                    <option value="silk">Silk</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GSM (100-300)
                  </label>
                  <input
                    type="number"
                    name="gsm"
                    value={formData.gsm}
                    onChange={handleChange}
                    min="100"
                    max="300"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="180"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6">Fit & Style</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fit
                  </label>
                  <select
                    name="fit"
                    value={formData.fit}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="slim">Slim</option>
                    <option value="regular">Regular</option>
                    <option value="loose">Loose</option>
                    <option value="oversized">Oversized</option>
                    <option value="athletic">Athletic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Neckline
                  </label>
                  <select
                    name="neckline"
                    value={formData.neckline}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="round">Round</option>
                    <option value="v-neck">V-Neck</option>
                    <option value="polo">Polo</option>
                    <option value="henley">Henley</option>
                    <option value="crew">Crew</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sleeve Length
                  </label>
                  <select
                    name="sleeveLength"
                    value={formData.sleeveLength}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="short">Short</option>
                    <option value="long">Long</option>
                    <option value="sleeveless">Sleeveless</option>
                    <option value="3/4">3/4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pattern
                  </label>
                  <select
                    name="pattern"
                    value={formData.pattern}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="solid">Solid</option>
                    <option value="striped">Striped</option>
                    <option value="printed">Printed</option>
                    <option value="checkered">Checkered</option>
                    <option value="graphic">Graphic</option>
                    <option value="plain">Plain</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Weight Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6">Product Weight</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight Value
                  </label>
                  <input
                    type="number"
                    value={formData.weight.value}
                    onChange={(e) => setFormData({
                      ...formData,
                      weight: { ...formData.weight, value: e.target.value }
                    })}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="250"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight Unit
                  </label>
                  <select
                    value={formData.weight.unit}
                    onChange={(e) => setFormData({
                      ...formData,
                      weight: { ...formData.weight, unit: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="g">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="space-y-8">
            {/* Main Product Images */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Product Images</h2>
                {uploadingImages && (
                  <span className="text-sm text-blue-600">Uploading...</span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50">
                  <span className="text-3xl text-gray-400">+</span>
                  <span className="text-xs text-gray-500 mt-1">Upload</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image
                      src={image.url}
                      alt={image.alt || `Product ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 px-2 py-1 bg-black text-white text-xs rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Color Variants */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Color Variants</h2>
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                >
                  + Add Color
                </button>
              </div>

              <div className="space-y-4">
                {formData.colors.map((color, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color Name
                        </label>
                        <input
                          type="text"
                          value={color.name}
                          onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                          placeholder="e.g. Navy Blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hex Code
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={color.hexCode}
                            onChange={(e) => handleColorChange(index, 'hexCode', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color.hexCode}
                            onChange={(e) => handleColorChange(index, 'hexCode', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(index)}
                          className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Remove Color
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.colors.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No color variants added yet. Click "Add Color" to start.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6">Size Inventory</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.sizes.map((sizeItem, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size {sizeItem.size}
                    </label>
                    <input
                      type="number"
                      value={sizeItem.stock}
                      onChange={(e) => {
                        const newSizes = [...formData.sizes];
                        newSizes[index].stock = parseInt(e.target.value) || 0;
                        setFormData({ ...formData, sizes: newSizes });
                      }}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="Stock"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Total Stock:</strong> {formData.sizes.reduce((sum, s) => sum + (s.stock || 0), 0)} units
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6">Care Instructions</h2>
              <div className="space-y-3">
                {formData.careInstructions.map((instruction, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...formData.careInstructions];
                        newInstructions[index] = e.target.value;
                        setFormData({ ...formData, careInstructions: newInstructions });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newInstructions = formData.careInstructions.filter((_, i) => i !== index);
                        setFormData({ ...formData, careInstructions: newInstructions });
                      }}
                      className="px-3 py-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      careInstructions: [...formData.careInstructions, '']
                    });
                  }}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  + Add Instruction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6">Search Engine Optimization</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    maxLength={60}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="SEO optimized title (max 60 characters)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.metaTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    maxLength={160}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                    placeholder="SEO optimized description (max 160 characters)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.keywords.join(', ')}
                    onChange={(e) => {
                      const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                      setFormData({ ...formData, keywords });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separate keywords with commas
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6">Search Preview</h2>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-blue-600 text-lg mb-1">
                  {formData.metaTitle || formData.name || 'Product Title'}
                </div>
                <div className="text-green-700 text-sm mb-2">
                  https://yourstore.com/products/{formData.name.toLowerCase().replace(/\s+/g, '-')}
                </div>
                <div className="text-gray-600 text-sm">
                  {formData.metaDescription || formData.shortDescription || 'Product description will appear here...'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}