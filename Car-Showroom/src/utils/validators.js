export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const cnicPattern = /^\d{5}-\d{7}-\d$/
export const phonePattern = /^(03\d{9}|\+923\d{9})$/
export const validateApplication = (form) => {
    const errors = {}
        ;['fullName', 'email', 'cnic', 'phone', 'address', 'city', 'color'].forEach((field) => { if (!form[field]?.trim()) errors[field] = 'Required' })
    if (form.email && !emailPattern.test(form.email)) errors.email = 'Enter a valid email'
    if (form.cnic && !cnicPattern.test(form.cnic)) errors.cnic = 'Use 12345-1234567-1'
    if (form.phone && !phonePattern.test(form.phone)) errors.phone = 'Use 03001234567 or +923001234567'
    return errors
}
