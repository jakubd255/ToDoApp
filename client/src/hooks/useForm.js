import { useState } from "react";



const useForm = fields => {
    const [form, setForm] = useState(fields);
    
    const updateForm = e => {
        setForm(form => ({
            ...form, [e.target.name]: e.target.value
        }));
    }

    const updateFormByName = (name, value) => {
        setForm(form => ({
            ...form, [name]: value
        }));
    }

    return {form, setForm, updateForm, updateFormByName};
}

export default useForm;