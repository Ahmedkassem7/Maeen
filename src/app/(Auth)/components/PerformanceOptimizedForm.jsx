"use client";

import { memo, useCallback, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useFormPerformance } from "@/hooks/useAuthPerformance";

// Memoized input field component
const FormInput = memo(
  ({
    label,
    name,
    type = "text",
    placeholder,
    icon: Icon,
    errors,
    touched,
    className = "",
    ...props
  }) => (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 text-right"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <Field
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`auth-input block w-full pr-4 ${
            Icon ? "pl-12" : "pl-4"
          } py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b1b49] focus:border-transparent text-right transition-all duration-300 ${
            errors[name] && touched[name]
              ? "border-red-300 bg-red-50 error-shake"
              : "border-gray-200 hover:border-gray-300"
          } ${className}`}
          {...props}
        />
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-600 text-right"
      />
    </div>
  )
);

FormInput.displayName = "FormInput";

// Memoized select field component
const FormSelect = memo(
  ({
    label,
    name,
    options,
    placeholder,
    loading = false,
    errors,
    touched,
    className = "",
    ...props
  }) => (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 text-right"
        >
          {label}
        </label>
      )}
      <Field
        as="select"
        id={name}
        name={name}
        disabled={loading}
        className={`auth-input block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#0b1b49] focus:border-transparent text-right transition-all duration-300 ${
          errors[name] && touched[name]
            ? "border-red-300 bg-red-50 error-shake"
            : "border-gray-200 hover:border-gray-300"
        } ${
          loading ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        } ${className}`}
        {...props}
      >
        <option value="" disabled>
          {loading ? "جاري التحميل..." : placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-600 text-right"
      />
    </div>
  )
);

FormSelect.displayName = "FormSelect";

// Memoized radio group component
const FormRadioGroup = memo(
  ({ label, name, options, errors, touched, className = "" }) => (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 text-right">
          {label}
        </label>
      )}
      <div className="flex gap-4 justify-start">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center flex-row-reverse gap-2 cursor-pointer"
          >
            <span className="text-gray-700">{option.label}</span>
            <Field
              type="radio"
              name={name}
              value={option.value}
              className="w-4 h-4 text-[#0b1b49] focus:ring-[#0b1b49] border-gray-300"
            />
          </label>
        ))}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-600 text-right"
      />
    </div>
  )
);

FormRadioGroup.displayName = "FormRadioGroup";

// Memoized submit button component
const SubmitButton = memo(
  ({ isLoading, isSubmitting, children, className = "", ...props }) => (
    <button
      type="submit"
      disabled={isLoading || isSubmitting}
      className={`auth-button w-full bg-gradient-to-r from-[#0b1b49] to-[#1e3fb8] text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ${
        isLoading || isSubmitting
          ? "opacity-70 cursor-not-allowed"
          : "hover:from-[#1e3fb8] hover:to-[#0b1b49]"
      } ${className}`}
      {...props}
    >
      {isLoading || isSubmitting ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
          جاري التحميل...
        </div>
      ) : (
        children
      )}
    </button>
  )
);

SubmitButton.displayName = "SubmitButton";

// Main form component
const PerformanceOptimizedForm = memo(
  ({
    initialValues,
    validationSchema,
    onSubmit,
    children,
    isLoading = false,
    className = "",
    ...props
  }) => {
    const { formRef, clearValidationCache } = useFormPerformance(
      initialValues,
      validationSchema
    );

    // Memoized form render function
    const renderForm = useCallback(
      ({ errors, touched, isSubmitting, ...formikProps }) => (
        <Form className={`space-y-6 ${className}`} dir="rtl" {...props}>
          {typeof children === "function"
            ? children({ errors, touched, isSubmitting, ...formikProps })
            : children}
        </Form>
      ),
      [children, className, props]
    );

    return (
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={false}
      >
        {renderForm}
      </Formik>
    );
  }
);

PerformanceOptimizedForm.displayName = "PerformanceOptimizedForm";

export default PerformanceOptimizedForm;
export { FormInput, FormSelect, FormRadioGroup, SubmitButton };
