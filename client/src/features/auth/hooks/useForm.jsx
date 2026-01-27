import { useState } from 'react';

const validations = {
  username: {
    required: 'Username is required',
    minLength: {
      value: 3,
      message: 'Username must be at least 3 characters',
    },
    maxLength: {
      value: 20,
      message: 'Username must not exceed 20 characters',
    },
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
    maxLength: {
      value: 12,
      message: 'Password must not exceed 12 characters',
    },
    pattern: {
      value:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/,
      message:
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol',
    },
  },
  confirmPassword: {
    required: 'Please confirm your password',
    validate: (value, formData) =>
      value === formData.password || 'Passwords do not match',
  },
};

export const useForm = (initialForm) => {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Client side validation
    const fieldValidation = validations[name];
    if (fieldValidation) {
      let fieldError = null;

      if (fieldValidation.required && !value.trim()) {
        fieldError = fieldValidation.required;
      } else if (
        fieldValidation.minLength &&
        value.length < fieldValidation.minLength.value
      ) {
        fieldError = fieldValidation.minLength.message;
      } else if (
        fieldValidation.maxLength &&
        value.length > fieldValidation.maxLength.value
      ) {
        fieldError = fieldValidation.maxLength.message;
      } else if (
        fieldValidation.pattern &&
        !fieldValidation.pattern.value.test(value)
      ) {
        fieldError = fieldValidation.pattern.message;
      } else if (fieldValidation.validate) {
        const updatedFormData = { ...formData, [name]: value };
        const validateResult = fieldValidation.validate(value, updatedFormData);
        if (validateResult !== true) {
          fieldError = validateResult;
        }
      }

      setError((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Mock API call
      const result = await new Promise((resolve) =>
        setTimeout(() => resolve({ success: true, message: 'Mock data' }), 2000)
      );

      // Validation errors from the server
      if (!result.success) {
        if (result.errors && Array.isArray(result.errors)) {
          const errors = initialForm;
          result.errors.forEach((error) => {
            errors[error.path] = error.message;
          });
          setError(errors);
        } else {
          setError({ global: result.message });
        }
      } else {
        setError(null);
        // TODO: Set user and accessToken
      }
    } catch (error) {
      setError({ global: error.message });
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, error, handleChange, onSubmit };
};
