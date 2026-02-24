import * as yup from 'yup'

const phoneRegex = /^[\d\s\-+()]{7,20}$/

export const registrationSchema = yup.object({
    parent1FirstName: yup.string()
        .trim()
        .min(2, 'Must be at least 2 characters')
        .max(50, 'Must be 50 characters or less')
        .required('Parent 1 first name is required'),
    parent1LastName: yup.string()
        .trim()
        .min(2, 'Must be at least 2 characters')
        .max(50, 'Must be 50 characters or less')
        .required('Parent 1 last name is required'),
    parent1IdNumber: yup.string()
        .trim()
        .min(5, 'Must be at least 5 characters')
        .required('Parent 1 ID number is required'),
    parent2FirstName: yup.string()
        .trim()
        .min(2, 'Must be at least 2 characters')
        .max(50, 'Must be 50 characters or less')
        .required('Parent 2 first name is required'),
    parent2LastName: yup.string()
        .trim()
        .min(2, 'Must be at least 2 characters')
        .max(50, 'Must be 50 characters or less')
        .required('Parent 2 last name is required'),
    parent2IdNumber: yup.string()
        .trim()
        .min(5, 'Must be at least 5 characters')
        .required('Parent 2 ID number is required'),
    childName: yup.string()
        .trim()
        .min(2, 'Must be at least 2 characters')
        .required("Child's name is required"),
    phoneNumber: yup.string()
        .trim()
        .matches(phoneRegex, 'Enter a valid phone number')
        .required('Phone number is required'),
    bankName: yup.string()
        .trim()
        .required('Bank name is required'),
    bankAccountNumber: yup.string()
        .trim()
        .required('Bank account number is required'),
    ageGroup: yup.string()
        .oneOf(['under1', 'over1'], 'Please select an age group')
        .required('Age group is required'),
    branch: yup.string()
        .oneOf(['cityCenter', 'germanColony'], 'Please select a branch')
        .required('Branch is required')
})

export const MAX_PDF_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_PDF_TYPE = 'application/pdf'

export const validatePDFFile = (file) => {
    if (!file) return { valid: true, error: null }
    if (file.type !== ALLOWED_PDF_TYPE) {
        return { valid: false, error: 'Only PDF files are allowed' }
    }
    if (file.size > MAX_PDF_SIZE) {
        return { valid: false, error: `File size must be less than 10MB (current: ${(file.size / 1024 / 1024).toFixed(1)}MB)` }
    }
    return { valid: true, error: null }
}
