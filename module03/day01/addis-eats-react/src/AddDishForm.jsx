import { useState } from 'react';

export default function AddDishForm({ onAddDish }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Main',
    spicy: false,
  });

  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};

    // 1. Name validation: required & at least 2 characters
    if (!formData.name.trim()) {
      newErrors.name = 'Dish name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Dish name must be at least 2 characters.';
    }

    // 2. Price validation: required & must be greater than 0
    if (!formData.price) {
      newErrors.price = 'Price is required.';
    } else if (Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than $0.';
    }

    setErrors(newErrors);
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error message for field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Stop submission if validation fails
    if (!validate()) return;

    onAddDish({
      id: Date.now(),
      name: formData.name.trim(),
      price: Number(formData.price),
      category: formData.category,
      spicy: formData.spicy,
    });

    // Reset form and errors after successful submit
    setFormData({ name: '', price: '', category: 'Main', spicy: false });
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="add-dish-form" noValidate>
      <h3>Add New Dish</h3>

      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error-text" style={{ color: 'red' }}>{errors.name}</p>}
      </div>

      <div className="form-group">
        <label>Price ($):</label>
        <input
          type="number"
          name="price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
        />
        {errors.price && <p className="error-text" style={{ color: 'red' }}>{errors.price}</p>}
      </div>

      <div className="form-group">
        <label>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Main">Main</option>
          <option value="Appetizer">Appetizer</option>
          <option value="Dessert">Dessert</option>
          <option value="Drink">Drink</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="spicy"
            checked={formData.spicy}
            onChange={handleChange}
          />
          Spicy
        </label>
      </div>

      <button type="submit">Add Dish</button>
    </form>
  );
}