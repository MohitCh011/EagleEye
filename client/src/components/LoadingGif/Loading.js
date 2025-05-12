import React from 'react';

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-orange-100 bg-opacity-50 flex flex-col justify-center items-center z-50 backdrop-blur-lg">
      <div className="flex justify-center items-center">
        <img
          alt="loading"
          src="https://media.tenor.com/SsN_iw5_OlAAAAAi/%D0%B0%D1%8D%D1%80%D0%BE%D1%81%D1%8C%D0%B5%D0%BC%D0%BA%D0%B0-%D0%B4%D1%80%D0%BE%D0%BD.gif"
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <h2 className='text-blue-950 text-4xl'>Please Wait Fetching Data.....</h2>
    </div>
  );
};

export default Loading;
