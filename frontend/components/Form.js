import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import axios from 'axios';

const validationErrors = {
  fullNameTooShort: 'Full name must be at least 3 characters',
  fullNameTooLong: 'Full name must be at most 20 characters',
  sizeIncorrect: 'Size must be S or M or L',
  toppingIncorrect: 'Invalid topping selection',
};


const Schema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required('Full name is required'),

  size: yup
    .string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required('Size is required'),

  pepperoni: yup.boolean(),
  greenPeppers: yup.boolean(),
  pineapple: yup.boolean(),
  mushrooms: yup.boolean(),
  ham: yup.boolean(),
});

const initialValues = {
  fullName: '',
  size: '',
  pepperoni: false,
  greenPeppers: false,
  pineapple: false,
  mushrooms: false,
  ham: false,
};

const initialErrors = {
  fullName: '',
  size: '',
  pepperoni: '',
  greenPeppers: '',
  pineapple: '',
  mushrooms: '',
  ham: '',
};

const toppings = [
  { topping_id: '1', text: 'Pepperoni', name: 'pepperoni' },
  { topping_id: '2', text: 'Green Peppers', name: 'greenPeppers' },
  { topping_id: '3', text: 'Pineapple', name: 'pineapple' },
  { topping_id: '4', text: 'Mushrooms', name: 'mushrooms' },
  { topping_id: '5', text: 'Ham', name: 'ham' },
];

export default function Form() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [enabled, setEnabled] = useState(false);
  const [serverSuccess, setServerSuccess] = useState('');
  const [serverFailure, setServerFailure] = useState('');

  useEffect(() => {
    Schema.isValid(values).then((isValid) => {
      setEnabled(isValid);
    });
  }, [values]);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const toppingsSelected = Object.keys(values).filter(
      (key) => values[key] === true
    ).map((key) => {
      const topping = toppings.find((t) => t.name === key);
      return topping ? topping.topping_id : null;
    }).filter((id) => id !== null);

    const order = {
      fullName: values.fullName,
      size: values.size,
      toppings: toppingsSelected,
    };

    axios.post('http://localhost:9009/api/order', order)
      .then((res) => {
        setValues(initialValues);
        setServerSuccess(res.data.message);
        setServerFailure('');
      })
      .catch((err) => {
        setServerFailure(err.response.data.message);
        setServerSuccess('');
      });
  };

  const onChange = (evt) => {
    const { type, checked, name, value } = evt.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setValues({ ...values, [name]: inputValue });

    yup
      .reach(Schema, name)
      .validate(inputValue)
      .then(() => {
        setErrors({ ...errors, [name]: '' });
      })
      .catch((error) => {
        setErrors({ ...errors, [name]: error.errors[0] });
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {errors.fullName && <span className="error">{errors.fullName}</span>}
      {errors.size && <span className="error">{errors.size}</span>}
      {serverSuccess && <h4 className="success">{serverSuccess}</h4>}
      {serverFailure && <h4 className="error">{serverFailure}</h4>}

      <div className="input-group">
        <label htmlFor="fullName">Full Name</label><br />
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={values.fullName}
          placeholder="Type full name"
          onChange={onChange}
        />
      </div>

      <div className="input-group">
        <label htmlFor="size">Size</label><br />
        <select
          id="size"
          name="size"
          value={values.size}
          onChange={onChange}
        >
          <option value="">----Choose Size----</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name={topping.name} 
              type="checkbox"
              checked={values[topping.name]} 
              onChange={onChange}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>

      <input disabled={!enabled} type="submit" value="Submit" />
    </form>
  );
}