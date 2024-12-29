import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const refreshToken = async () => {
  const cookies = new Cookies();
  const refreshToken = cookies.get('refreshToken');
  const response = await axios.get('/api/auth/refresh', {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  return response.data.data.accessToken;
};

export const useRefreshToken = () => {
  const navigate = useNavigate();
  return useMutation(refreshToken, {
    onSuccess: (data) => {
      const cookies = new Cookies();
      cookies.set('refreshToken', data, { path: '/' });
    },
    onError: () => {
      alert('예기치 못한 오류가 발생하였습니다. 다시 로그인해주세요');
      navigate('/');
    },
  });
};
