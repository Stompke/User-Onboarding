import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const MyForm = ({values, errors, touched, status}) => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log('status has changed', status);
        status && setUsers(users => [...users, status]);
    }, [status]);

    return (
        <div className='custom-form'>
                
            <Form>
                <Field  name='name' type='text' placeholder='name'/>
                {touched.name && errors.name && <span className='errors'>{errors.name}</span>}
                <br />
                <Field  name='email' type='text' placeholder='email'/>
                {errors.email && touched.email ? <div>{errors.email}</div> : null}
                <br />
                <Field  name='password' type='password' placeholder='password'/>
                <br />
                <span>I have read the terms</span><Field  name='terms' type='checkbox' />
                <br />
                <button type='submit' >Submit</button>



            </Form>
            
            {users.map(user => (
                <ul key={user.id}>
                    <li>Name: {user.name}</li>
                    <li>Email: {user.email}</li>
                    <li>Password: {user.password}</li>
                    <li>Agreed to terms: {user.terms ? 'Yes' : 'No'}</li>
                </ul>
            ))}
            
        </div>
    );
}

const FormikMyForm = withFormik({
    mapPropsToValues({name , email}) {
        return {
            name: '',
            email: '',
            password: ''
        };
    },
    validationSchema: Yup.object().shape({
        name: Yup.string()
            .required('Please enter a name.')
            .min(3, 'Too Short!')
            .max(15, 'Too long!'),

        email: Yup.string()
            .email('Invalid Email')
            .required('Please enter an email')
            .matches('waffle@syrup.com', 'email already taken')
      }),
      handleSubmit(values, {setStatus, resetForm}) {
          console.log('submitting...', values);
          axios
            .post("https://reqres.in/api/users", values)
            .then(res => {
                console.log('success', res)
                setStatus(res.data);
                resetForm();
            })
            .catch(err => {
                console.log(err.response);
            })
      }
})(MyForm);

export default FormikMyForm