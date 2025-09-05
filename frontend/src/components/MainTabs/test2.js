
const normalizeValue = (value) => value ? value.toLowerCase() : '';

const BookingForm = () => {
	const [formValue, setFormValues] = useState({name: '', email: '', checkInDate: ''});
	const [errors, setErrors] = useState({});

	//Clear error state for a specific field
	const clearError = (field) => {
		setErrors(prevErrors => ({
			...prevErrors,
			[field]: null
		}));
	};

	//Handle data change (after normalizing value)
	const handleDataChange = (field, value) => {
		setFormValues(prevValues => ({
			...prevValues,
			[field]: normalizeValue(value)
		}));
	};

	return (
		<div>
			
		</div>
	);

};

export default BookingForm;
export {normalizeValue};