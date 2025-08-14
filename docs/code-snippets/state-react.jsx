import { useState } from "react";

const useFormState = (initialValues) => {
  // React State Management mit funktionalen Hooks
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Immutable State Updates durch neue Objekte
  const updateField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  // Validation führt zu separatem State Update
  const validateField = (field, value) => {
    const errorMessage = value ? null : "Field is required";
    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

  return { values, errors, updateField, validateField };
};

useFormState();
