import { Toaster, toast } from "react-hot-toast";

export { toast };

const MHToaster = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        success: {
          duration: 2000,
        },
        error: {
          duration: 4000,
        },
      }}
    />
  );
};

export default MHToaster;
