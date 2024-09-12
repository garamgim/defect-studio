import axios from 'axios';
import axiosInstance from './token/axiosInstance';

export type departmentType = {
  department_id: number;
  department_name: string;
};

export const getAllDepartments = async () => {
  try {
    const response = await axios.get<departmentType[]>('http://j11s001.p.ssafy.io:8000/api/departments');
    return response;
  } catch (error) {
    throw new Error('Failed to get all departments');
  }
};

export type DepartmentPersonType = {
  name: string;
  nickname: string;
  token_quantity: number;
  member_id: number;
};

export const getDepartmentPeople = async (departmentId: number) => {
  try {
    const response = await axiosInstance.get(`/departments/${departmentId}/members`);
    return response;
  } catch (error) {
    throw new Error('Unexpected error occurred');
  }
};
