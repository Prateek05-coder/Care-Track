import React, { useState, useEffect } from 'react';

const MedicalHistoryModal = ({ show, onClose, onSave, historyItem }) => {
  const [formData, setFormData] = useState({
    condition: '',
    diagnosisDate: '',
    treatment: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (historyItem) {
      setFormData({
        condition: historyItem.condition || '',
        diagnosisDate: historyItem.diagnosisDate ? historyItem.diagnosisDate.substring(0, 10) : '',
        treatment: historyItem.treatment || '',
        notes: historyItem.notes || ''
      });
    } else {
      setFormData({
        condition: '',
        diagnosisDate: '',
        treatment: '',
        notes: ''
      });
    }
    setErrors({});
  }, [historyItem, show]);

  if (!show) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.condition.trim()) {
      newErrors.condition = 'Condition is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{historyItem ? 'Edit Medical History' : 'Add Medical History'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="condition" className="form-label">Condition*</label>
                <input
                  type="text"
                  className={`form-control ${errors.condition ? 'is-invalid' : ''}`}
                  id="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">{errors.condition}</div>
              </div>
              <div className="mb-3">
                <label htmlFor="diagnosisDate" className="form-label">Diagnosis Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="diagnosisDate"
                  value={formData.diagnosisDate}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="treatment" className="form-label">Treatment</label>
                <textarea
                  className="form-control"
                  id="treatment"
                  rows="3"
                  value={formData.treatment}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  id="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">{historyItem ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryModal;
