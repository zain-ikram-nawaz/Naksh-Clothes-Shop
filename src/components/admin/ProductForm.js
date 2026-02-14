'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SECTIONS = [
  { id: 'basic', label: 'Basic Info', icon: '📋' },
  { id: 'media', label: 'Media', icon: '🖼️' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'details', label: 'Details', icon: '✨' },
];

const DEFAULT_SIZES = [
  { size: 'S', stock: 0 },
  { size: 'M', stock: 0 },
  { size: 'L', stock: 0 },
  { size: 'XL', stock: 0 },
];

const DEFAULT_CARE = [
  'Machine wash cold',
  'Do not bleach',
  'Tumble dry low',
  'Iron on low heat',
];

export default function ProductForm({ product = null, isEdit = false }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    category: product?.category?._id || '',
    status: product?.status || 'active',
    featured: product?.featured || false,
    sku: product?.sku || '',
    images: product?.images || [],
    sizes: product?.sizes || DEFAULT_SIZES,
    features: product?.features || [],
    careInstructions: product?.careInstructions || DEFAULT_CARE,
    material: product?.material || '100% Cotton',
    fit: product?.fit || 'regular',
    ...product,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const token = localStorage.getItem('token');

    try {
      const uploads = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'products');

          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          const data = await res.json();
          return data.success ? {
            url: data.data.url,
            publicId: data.data.publicId,
            alt: formData.name || 'Product Image',
          } : null;
        })
      );

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploads.filter(Boolean)],
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index) => {
    const image = formData.images[index];
    const token = localStorage.getItem('token');

    try {
      await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId: image.publicId }),
      });

      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSizeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) =>
        i === index ? { ...size, [field]: field === 'stock' ? parseInt(value) || 0 : value } : size
      ),
    }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: 'M', stock: 0 }],
    }));
  };

  const removeSize = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = isEdit ? `/api/admin/products?id=${product._id}` : '/api/admin/products';

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
        router.push('/admin/products');
      } else {
        alert(data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const Input = ({ label, name, type = 'text', required, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required={required}
          rows={4}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required={required}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          {...props}
        />
      )}
    </div>
  );

  const Select = ({ label, name, options, required, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white"
        {...props}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {isEdit ? 'Edit Product' : 'New Product'}
          </h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-6 overflow-x-auto">
            {SECTIONS.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={`py-4 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                  activeSection === id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Basic Info */}
        {activeSection === 'basic' && (
          <div className="bg-white rounded-xl border p-6 space-y-6">
            <Input label="Product Name" name="name" required placeholder="Premium Cotton T-Shirt" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Category"
                name="category"
                required
                options={[
                  { value: '', label: 'Select Category' },
                  ...categories.map(c => ({ value: c._id, label: c.name })),
                ]}
              />
              <Input label="SKU" name="sku" placeholder="TSHIRT-001" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Price (₹)" name="price" type="number" required min="0" />
              <Input label="Compare Price (₹)" name="comparePrice" type="number" min="0" />
            </div>

            <Input label="Description" name="description" type="textarea" required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Status"
                name="status"
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'draft', label: 'Draft' },
                ]}
              />
              <div className="flex items-center gap-4 pt-8">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Featured</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Media */}
        {activeSection === 'media' && (
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-medium mb-4">Images</h2>

            <div className="mb-6">
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload images'}
                  </p>
                </label>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group aspect-square">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Inventory */}
        {activeSection === 'inventory' && (
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-medium mb-4">Sizes & Stock</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {formData.sizes.map((size, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium">Size</span>
                    {formData.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <select
                    value={size.size}
                    onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                  >
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <Input
                    label="Stock"
                    type="number"
                    value={size.stock}
                    onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                    min="0"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSize}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
            >
              + Add Size
            </button>
          </div>
        )}

        {/* Details */}
        {activeSection === 'details' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-medium mb-4">Material & Fit</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Material" name="material" required />
                <Select
                  label="Fit"
                  name="fit"
                  options={[
                    { value: 'slim', label: 'Slim' },
                    { value: 'regular', label: 'Regular' },
                    { value: 'loose', label: 'Loose' },
                    { value: 'oversized', label: 'Oversized' },
                  ]}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-medium mb-4">Features</h2>

              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleArrayChange('features', index, e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="e.g., Breathable fabric"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('features', index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayItem('features')}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
              >
                + Add Feature
              </button>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-medium mb-4">Care Instructions</h2>

              {formData.careInstructions.map((instruction, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={instruction}
                    onChange={(e) => handleArrayChange('careInstructions', index, e.target.value)}
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('careInstructions', index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayItem('careInstructions', '')}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
              >
                + Add Instruction
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}