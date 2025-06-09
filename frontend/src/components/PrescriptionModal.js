import React, { useState, useEffect } from 'react';

const PrescriptionModal = ({ show, onClose, onSave, prescription }) => {
  const [form, setForm] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  useEffect(() => {
    if (prescription) {
      setForm({
        medicationName: prescription.medicationName || '',
        dosage: prescription.dosage || '',
        frequency: prescription.frequency || '',
        startDate: prescription.startDate ? prescription.startDate.split('T')[0] : '',
        endDate: prescription.endDate ? prescription.endDate.split('T')[0] : '',
        notes: prescription.notes || ''
      });
    } else {
      setForm({
        medicationName: '',
        dosage: '',
        frequency: '',
        startDate: '',
        endDate: '',
        notes: ''
      });
    }
  }, [prescription, show]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.medicationName || !form.dosage || !form.frequency || !form.startDate || !form.endDate) {
      alert('Please fill all required fields.');
      return;
    }
    onSave(form);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{prescription ? 'Edit Prescription' : 'Add Prescription'}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">Medication Name *</label>
                <input type="text" className="form-control" name="medicationName" value={form.medicationName} onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Dosage *</label>
                <input type="text" className="form-control" name="dosage" value={form.dosage} onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Frequency *</label>
                <input type="text" className="form-control" name="frequency" value={form.frequency} onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Start Date *</label>
                <input type="date" className="form-control" name="startDate" value={form.startDate} onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label">End Date *</label>
                <input type="date" className="form-control" name="endDate" value={form.endDate} onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Notes</label>
                <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">{prescription ? 'Save Prescription' : 'Save Prescription'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;