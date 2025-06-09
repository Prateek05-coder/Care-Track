import React, { useState, useEffect } from "react";

const PatientModal = ({ show, onClose, onSave, patient }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    allergies: "",
    medications: "",
    lastVisit: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Ensure form fields are initialized correctly
  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        dob: patient.dob ? patient.dob.split("T")[0] : "",
        gender: patient.gender || "",
        phone: patient.phone || "",
        email: patient.email || "",
        address: patient.address || "",
        allergies: patient.allergies || "",
        medications: patient.medications || "",
        lastVisit: patient.lastVisit ? patient.lastVisit.split("T")[0] : "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        allergies: "",
        medications: "",
        lastVisit: "",
      });
    }
    setErrors({});
  }, [patient, show]);

  // ✅ Fix: Properly update formData state
  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(`Updating ${name} to:`, value); // ✅ Debugging output

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Fix: Ensure patient data is saved correctly
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // ✅ Prevent submission if validation fails

    const dataToSend = {
      ...formData,
      lastVisit: formData.lastVisit || "",
    };

    try {
      await onSave(dataToSend);
      console.log("Saved Patient Data:", dataToSend);
      onClose();
    } catch (error) {
      console.error("Error saving patient:", error);
    }
  };

  if (!show) return null;

  // ✅ Fix: Ensure proper validation before saving
  const validate = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (formData.phone.trim().length > 10) newErrors.phone = "Phone number cannot exceed 10 digits";
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = "Please enter a valid email";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{patient ? "Edit Patient" : "Add Patient"}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
              {/* ✅ Fix: Ensure all inputs properly bind to `handleChange` */}
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="firstName" className="form-label">First Name*</label>
                  <input
                    type="text"
                    className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">{errors.firstName}</div>
                </div>
                <div className="col">
                  <label htmlFor="lastName" className="form-label">Last Name*</label>
                  <input
                    type="text"
                    className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">{errors.lastName}</div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="dob" className="form-label">Date of Birth*</label>
                  <input
                    type="date"
                    className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">{errors.dob}</div>
                </div>
                <div className="col">
                  <label htmlFor="gender" className="form-label">Gender*</label>
                  <select
                    className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                  <div className="invalid-feedback">{errors.gender}</div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone Number*</label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">{errors.phone}</div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email*
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="allergies" className="form-label">Allergies</label>
                <textarea className="form-control" id="allergies" name="allergies" rows="2" value={formData.allergies} onChange={handleChange}></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="medications" className="form-label">Current Medications</label>
                <textarea className="form-control" id="medications" name="medications" rows="2" value={formData.medications} onChange={handleChange}></textarea>
              </div>
            </div>
             
          <div className="mb-3">
                <label htmlFor="lastVisit" className="form-label">Last Visit</label>
                <input
                  type="date"
                  className="form-control"
                  name="lastVisit"
                  value={formData.lastVisit || ''}
                  onChange={handleChange}
                />
              </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">{patient ? "Update Patient" : "Save Patient"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;