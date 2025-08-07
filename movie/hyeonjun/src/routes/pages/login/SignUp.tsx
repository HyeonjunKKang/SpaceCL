const SignUp = () => {
  return (
    <div className="flex w-full h-screen items-center justify-cente">
      <div className="mx-auto w-[400px] bg-blue-100 p-4 rounded-[4px]">
        <h1 className="text-center">JOIN</h1>
        <form
          className="flex flex-col gap-3"
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <p>name</p>
          <input required className="bg-white w-full p-2 rounded-[4px]" type="text" />
          <p>email</p>
          <input required className="bg-white w-full p-2 rounded-[4px]" type="email" />
          <p>password</p>
          <input required className="bg-white w-full p-2 rounded-[4px]" type="password" />
          <p>confirm password</p>
          <input required className="bg-white w-full p-2 rounded-[4px]" type="password" />

          <button className="p-2 mt-10 bg-white">OK</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
