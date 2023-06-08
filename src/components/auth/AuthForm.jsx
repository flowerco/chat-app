import { useState } from 'react';
import { login, register } from '../../lib/api';
import { useDispatch } from 'react-redux';
import { authLogin } from '../../redux/authSlice';
import Card from './Card';
import Input from './Input';

const registerContent = {
  linkUrl: '/signin',
  linkText: 'Already have an account?',
  header: 'Create a New Account',
  subheader: 'Just a few things to get started',
  buttonText: 'Register',
};

const signinContent = {
  linkUrl: '/register',
  linkText: "Don't have an account?",
  header: 'Welcome Back',
  subheader: 'Enter your credentials to access your account',
  buttonText: 'Sign In',
};

const initial = { firstName: '', lastName: '', email: '', password: '' };

export default function AuthForm() {
  const [formState, setFormState] = useState(initial);
  const [mode, setMode] = useState('signin');

  const dispatch = useDispatch();

  const content = mode === 'register' ? registerContent : signinContent;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (mode === 'register') {
        const data = await register(formState);
        if (data) {
          dispatch(authLogin(data));
        }
      } else {
        const data = await login({ email: formState.email, password: formState.password} );
        if (data) {
          dispatch(authLogin(data));
        } else {
          // TODO: Handle redirect if login failed
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <div className='w-full'>
        <div className='text-center'>
          <h2 className='text-3xl mb-2'>{content.header}</h2>
          <p className='tex-lg text-black/25'>{content.subheader}</p>
        </div>
        <form onSubmit={handleSubmit} className='py-10 w-full'>
          {mode === 'register' && (
            <div className='flex mb-8 justify-between'>
              <div className='pr-2'>
                <div className='text-lg mb-4 ml-2 text-black/50'>
                  First Name
                </div>
                <Input
                  required
                  placeholder='First Name'
                  value={formState.firstName}
                  autoComplete='given-name'
                  className='border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full'
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, firstName: e.target.value }))
                  }
                />
              </div>
              <div className='pl-2'>
                <div className='text-lg mb-4 ml-2 text-black/50'>Last Name</div>
                <Input
                  required
                  placeholder='Last Name'
                  value={formState.lastName}
                  autoComplete='family-name'
                  className='border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full'
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, lastName: e.target.value }))
                  }
                />
              </div>
            </div>
          )}
          <div className='mb-8'>
            <div className='text-lg mb-4 ml-2 text-black/50'>Email</div>
            <Input
              autoFocus
              required
              type='email'
              placeholder='Email'
              value={formState.email}
              autoComplete='email'
              className='border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full'
              onChange={(e) =>
                setFormState((s) => ({ ...s, email: e.target.value }))
              }
            />
          </div>
          <div className='mb-8'>
            <div className='text-lg mb-4 ml-2 text-black/50'>Password</div>
            <Input
              required
              value={formState.password}
              type='password'
              placeholder='Password'
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              className='border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full'
              onChange={(e) =>
                setFormState((s) => ({ ...s, password: e.target.value }))
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <span
                className='text-blue-700 underline cursor-pointer'
                onClick={(e) =>
                  setMode(mode === 'signin' ? 'register' : 'signin')
                }
              >
                {content.linkText}
              </span>
            </div>
            <div>
              <button
                className='rounded-3xl font-bold hover:scale-110 active:scale-100 transition duration-200 ease-in-out bg-violet-500 text-white border-transparent hover:bg-violet-600 text-lg px-6 py-2'
                type='submit'
                intent='secondary'
              >
                {content.buttonText}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}
