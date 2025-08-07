const Login = () => {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="w-[400px] mx-auto my-auto bg-blue-100 p-4 rounded-[4px]">
        <p>Login</p>
        <form className="flex flex-col gap-5">
          <div className="flex gap-5 items-center">
            <p className="w-[50px]">ID</p>
            <input required className="bg-white w-full p-2 rounded-[4px]" type="email" />
          </div>
          <div className="flex gap-5 items-center">
            <p className="w-[50px]">PW</p>
            <input required className="bg-white w-full p-2 rounded-[4px]" type="email" />
          </div>
          <button className="p-2 mt-10 bg-white">OK</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
