import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (message) => toast.success(message);
export const notifyError = (message) => toast.error(message);

export const initToast = () => {
  toast.configure();
};
