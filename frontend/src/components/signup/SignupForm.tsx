import { getAllDepartments } from '@/api/department';
import { useQuery } from '@tanstack/react-query';
import { departmentType } from '@/api/department';
import { AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';
import { signUpFormType } from '@/types/user';

interface SignupFormProps {
  signupForm: signUpFormType;
  setSignupForm: React.Dispatch<React.SetStateAction<signUpFormType>>;
  setSignUpPage: React.Dispatch<React.SetStateAction<'FormPage' | 'Verifying Page'>>;
}

const SignupForm = ({ signupForm, setSignupForm, setSignUpPage }: SignupFormProps) => {
  // 부서 정보 가져오기
  const {
    data: department_list,
    isPending,
    isError,
    error
  } = useQuery<AxiosResponse<departmentType[]>, Error, departmentType[], (string | number)[]>({
    queryKey: ['departments'],
    queryFn: getAllDepartments,
    select: (data) => data.data
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors }
  } = useForm<signUpFormType>({ mode: 'onChange', defaultValues: signupForm });

  // 조건부 렌더링
  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  else
    return (
      <section className="flex flex-col items-center mt-[120px] mb-10">
        <form
          onSubmit={handleSubmit((data) => {
            setSignupForm(data);
            setSignUpPage('Verifying Page');
          })}
        >
          {/* username (user_id) */}
          <div className="h-[85px]">
            <label htmlFor="username" className="mb-2 text-[16px] font-samsung font-bold text-black dark:text-white">
              UserName
            </label>
            <input
              type="text"
              id="username"
              {...register('login_id', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 4 characters long'
                },
                maxLength: {
                  value: 20,
                  message: 'Username must be less than 16 characters long'
                },
                pattern: {
                  value: /^[a-zA-Z0-9]*$/,
                  message: 'Username must contain only alphabets and numbers'
                }
              })}
              className=" mb-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[400px] h-[50px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Username"
              required
            />
            {errors.login_id && <p className="text-red-500 text-xs mt-1">{errors.login_id.message}</p>}
          </div>

          {/* password */}
          <div className="mt-5 h-[85px]">
            <label htmlFor="password" className="mb-2 text-[16px] font-samsung font-bold text-gray-900 dark:text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long'
                },
                maxLength: {
                  value: 20,
                  message: 'Password must be less than 20 characters long'
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/,
                  message: 'Password must contain only alphabets and numbers'
                }
              })}
              className=" mb-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[400px] h-[50px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Password"
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {/* Name */}
          <div className="mt-5 h-[85px]">
            <label htmlFor="name" className="mb-2 text-[16px] font-samsung font-bold text-gray-900 dark:text-white">
              Name
            </label>
            <input
              type="name"
              id="name"
              {...register('name', {
                required: 'Name is required',
                maxLength: {
                  value: 15,
                  message: 'Name must be less than 15 characters long'
                },
                pattern: {
                  value: /^[a-zA-Z0-9가-힣]+$/,
                  message: 'Name can only contain letters, numbers, and Korean characters'
                }
              })}
              className=" mb-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[400px] h-[50px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Name"
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          {/* 닉네임 */}
          <div className="mt-5 h-[85px]">
            <label htmlFor="nickname" className="mb-2 text-[16px] font-samsung font-bold text-gray-900 dark:text-white">
              Nickname
            </label>
            <input
              type="nickname"
              id="nickname"
              {...register('nickname', {
                required: 'Nickname is required',

                maxLength: {
                  value: 15,
                  message: 'Nickname must be less than 15 characters long'
                },
                pattern: {
                  value: /^[a-zA-Z0-9가-힣]+$/,
                  message: 'Nickname can only contain letters, numbers, and Korean characters'
                }
              })}
              className=" mb-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[400px] h-[50px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Nickname"
              required
            />
          </div>
          {/* 이메일 */}
          <div className="mt-5 h-[85px]">
            <label htmlFor="email" className="mb-2 text-[16px] font-samsung font-bold text-gray-900 dark:text-white">
              Email
            </label>

            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-[400px] h-[50px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
              placeholder="Email"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="mt-5">
            <label
              htmlFor="department_id"
              className="mb-2 text-[16px] font-samsung font-bold text-gray-900 dark:text-white"
            >
              Department
            </label>
            <select
              name=""
              id=""
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-[50px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {department_list?.map((department) => (
                <option key={department.department_id} value={department.department_id}>
                  {department.department_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="active:scale-95 hover:scale-105 disabled:hover:scale-100 font-bold w-[400px] h-[50px] bg-blue-500 text-white rounded-lg mt-10 disabled:opacity-50 transition transform duration-150 ease-in-out"
              disabled={!isValid || isSubmitting}
            >
              Verify Email & Sign Up
            </button>
          </div>
        </form>
      </section>
    );
};

export default SignupForm;
