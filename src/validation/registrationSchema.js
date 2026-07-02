import * as yup from 'yup'

const phoneRegex = /^[\d\s\-+()]{7,20}$/

export const createRegistrationSchema = (t) => yup.object({
    parent1FirstName: yup.string()
        .trim()
        .min(2, t('validation.min2'))
        .max(50, t('validation.max50'))
        .required(t('validation.parent1FirstNameRequired')),
    parent1LastName: yup.string()
        .trim()
        .min(2, t('validation.min2'))
        .max(50, t('validation.max50'))
        .required(t('validation.parent1LastNameRequired')),
    parent1IdNumber: yup.string()
        .trim()
        .min(5, t('validation.min2'))
        .required(t('validation.parent1IdRequired')),
    parent2FirstName: yup.string()
        .trim()
        .min(2, t('validation.min2'))
        .max(50, t('validation.max50'))
        .required(t('validation.parent2FirstNameRequired')),
    parent2LastName: yup.string()
        .trim()
        .min(2, t('validation.min2'))
        .max(50, t('validation.max50'))
        .required(t('validation.parent2LastNameRequired')),
    parent2IdNumber: yup.string()
        .trim()
        .min(5, t('validation.min2'))
        .required(t('validation.parent2IdRequired')),
    childName: yup.string()
        .trim()
        .min(2, t('validation.min2'))
        .required(t('validation.childNameRequired')),
    phoneNumber: yup.string()
        .trim()
        .matches(phoneRegex, t('validation.phoneInvalid'))
        .required(t('validation.phoneRequired')),
    bankName: yup.string()
        .trim()
        .required(t('validation.bankNameRequired')),
    bankAccountNumber: yup.string()
        .trim()
        .required(t('validation.bankAccountRequired')),
    ageGroup: yup.string()
        .oneOf(['under1', 'over1'], t('validation.ageGroupOneOf'))
        .required(t('validation.ageGroupRequired')),
    branch: yup.string()
        .oneOf(['cityCenter', 'germanColony'], t('validation.branchOneOf'))
        .required(t('validation.branchRequired'))
})

export const MAX_PDF_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_PDF_TYPE = 'application/pdf'

export const validatePDFFile = (file, t) => {
    if (!file) return { valid: true, error: null }
    if (file.type !== ALLOWED_PDF_TYPE) {
        return { valid: false, error: t('validation.pdfOnly') }
    }
    if (file.size > MAX_PDF_SIZE) {
        return { valid: false, error: t('validation.maxFileSize', { size: (file.size / 1024 / 1024).toFixed(1) }) }
    }
    return { valid: true, error: null }
}
