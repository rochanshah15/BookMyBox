import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, MapPin, DollarSign, FileText, Check, UploadCloud } from 'lucide-react';
import { useBox } from '../../context/BoxContext';

const AddBoxForm = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    sports: [],
    location: '',
    price: '',
    capacity: '',
    description: '',
    amenities: [],
    images: [], // This will hold File objects for upload
    rules: '',
    contactInfo: '',
    full_description: '',
    latitude: '',
    longitude: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { addBox } = useBox();

  const availableSports = [
    'Cricket', 'Football', 'Tennis', 'Badminton', 'Basketball', 
    'Pickleball', 'Volleyball', 'Table Tennis', 'Squash', 'Baseball'
  ];
  const availableAmenities = [
    'Changing Room', 'Parking', 'Equipment Rental', 'Coaching', 
    'Floodlights', 'AC/Heating', 'Refreshments', 'WiFi', 
    'Security', 'First Aid', 'Lockers', 'Shower'
  ];
  const steps = [
    { id: 1, title: 'Basic Info', icon: FileText },
    { id: 2, title: 'Sports & Pricing', icon: DollarSign },
    { id: 3, title: 'Details & Images', icon: MapPin },
    { id: 4, title: 'Review & Submit', icon: Check }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSportToggle = (sport) => {
    setFormData(prev => ({ ...prev, sports: prev.sports.includes(sport) ? prev.sports.filter(s => s !== sport) : [...prev.sports, sport] }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({ ...prev, amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity] }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, images: Array.from(e.target.files) }));
      if (errors.images) {
        setErrors(prev => ({...prev, images: ''}));
      }
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Box name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        break;
      case 2:
        if (formData.sports.length === 0) newErrors.sports = 'Select at least one sport';
        if (!formData.price || formData.price <= 0) newErrors.price = 'A valid price is required';
        if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = 'A valid capacity is required';
        break;
      case 3:
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (formData.amenities.length === 0) newErrors.amenities = 'Select at least one amenity';
        if (formData.images.length === 0) newErrors.images = 'Please upload at least one image for your facility.';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
        setErrors(prev => ({...prev, submit: 'Please fix the errors in all steps before submitting.'}));
        setCurrentStep(1);
        return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      const result = await addBox(formData);
      
      if (result.success) {
        setSubmitted(true);
        setTimeout(() => {
          onSuccess?.();
          onClose();
          setFormData({ name: '', sports: [], location: '', price: '', capacity: '', description: '', amenities: [], images: [], rules: '', contactInfo: '' });
          setCurrentStep(1);
          setSubmitted(false);
        }, 2000);
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'A client-side error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} className="text-green-600 dark:text-green-400" /></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Box Submitted Successfully!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Your sports box has been submitted and is now <span className="font-semibold text-yellow-600 dark:text-yellow-400">pending admin approval</span>. You'll be notified once it's reviewed and approved.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Add New Sports Box</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b flex items-center space-x-4">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <step.icon size={20} className={currentStep === step.id ? 'text-primary-600' : 'text-gray-400'} />
              <span className={`ml-2 font-medium ${currentStep === step.id ? 'text-primary-600' : 'text-gray-500'}`}>{step.title}</span>
              {idx < steps.length - 1 && <span className="mx-2 text-gray-300">→</span>}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Box Name *</label>
                <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className={`input-field ${errors.name ? 'border-red-500' : ''}`} placeholder="e.g., Elite Sports Arena" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className={`input-field ${errors.description ? 'border-red-500' : ''}`} rows="2" placeholder="Short description..." />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                <textarea value={formData.full_description} onChange={(e) => handleChange('full_description', e.target.value)} className="input-field" rows="3" placeholder="Full details about your facility..." />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Available Sports *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableSports.map(sport => ( <label key={sport} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.sports.includes(sport) ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}><input type="checkbox" checked={formData.sports.includes(sport)} onChange={() => handleSportToggle(sport)} className="sr-only" /><span className="text-sm font-medium">{sport}</span></label>))}
                </div>
                {errors.sports && <p className="text-red-500 text-sm mt-1">{errors.sports}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} className={`input-field ${errors.price ? 'border-red-500' : ''}`} placeholder="e.g., 500" />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
                  <input type="number" value={formData.capacity} onChange={(e) => handleChange('capacity', e.target.value)} className={`input-field ${errors.capacity ? 'border-red-500' : ''}`} placeholder="e.g., 20" />
                  {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input type="text" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} className={`input-field ${errors.location ? 'border-red-500' : ''}`} placeholder="e.g., Near Iscon Temple, SG Highway, Ahmedabad" />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                  <input type="number" value={formData.latitude} onChange={(e) => handleChange('latitude', e.target.value)} className="input-field" placeholder="e.g., 23.0225" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                  <input type="number" value={formData.longitude} onChange={(e) => handleChange('longitude', e.target.value)} className="input-field" placeholder="e.g., 72.5714" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Amenities *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableAmenities.map(amenity => ( <label key={amenity} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.amenities.includes(amenity) ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}><input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} className="sr-only" /><span className="text-sm font-medium">{amenity}</span></label>))}
                </div>
                {errors.amenities && <p className="text-red-500 text-sm mt-1">{errors.amenities}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facility Images *</label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.images ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-md`}>
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500"><span>Upload files</span><input id="file-upload" type="file" className="sr-only" multiple onChange={handleImageChange} accept="image/*"/></label>
                    </div>
                </div>
                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
                        {formData.images.map((file, i) => (<div key={i} className="relative"><img src={URL.createObjectURL(file)} alt="preview" className="h-24 w-full object-cover rounded-md"/></div>))}
                    </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rules</label>
                <textarea value={formData.rules} onChange={(e) => handleChange('rules', e.target.value)} className="input-field" rows="2" placeholder="Any rules for your facility?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Info</label>
                <input type="text" value={formData.contactInfo} onChange={(e) => handleChange('contactInfo', e.target.value)} className="input-field" placeholder="Phone, email, etc." />
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Review Your Submission</h3>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div><strong>Box Name:</strong> {formData.name}</div>
                  <div><strong>Short Description:</strong> {formData.description}</div>
                  <div><strong>Full Description:</strong> {formData.full_description}</div>
                  <div><strong>Sports:</strong> {formData.sports.join(', ')}</div>
                  <div><strong>Price:</strong> ₹{formData.price}</div>
                  <div><strong>Capacity:</strong> {formData.capacity}</div>
                  <div><strong>Location:</strong> {formData.location}</div>
                  <div><strong>Latitude:</strong> {formData.latitude}</div>
                  <div><strong>Longitude:</strong> {formData.longitude}</div>
                  <div><strong>Amenities:</strong> {formData.amenities.join(', ')}</div>
                  <div><strong>Rules:</strong> {formData.rules}</div>
                  <div><strong>Contact Info:</strong> {formData.contactInfo}</div>
                  <div><strong>Images:</strong> {formData.images.length} file(s) selected</div>
                  {formData.images.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {formData.images.map((file, i) => (<img key={i} src={URL.createObjectURL(file)} alt="preview" className="h-16 w-full object-cover rounded-md" />))}
                    </div>
                  )}
                </div>
                {errors.submit && (<div className="bg-red-50 p-3 rounded-lg"><p className="text-red-800 text-sm">{errors.submit}</p></div>)}
             </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div>{currentStep > 1 && (<button onClick={handlePrevious} className="btn-secondary">Previous</button>)}</div>
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            {currentStep < 4 ? (<button onClick={handleNext} className="btn-primary">Next</button>) : (<button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary disabled:opacity-50">{isSubmitting ? 'Submitting...' : 'Submit for Approval'}</button>)}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddBoxForm;