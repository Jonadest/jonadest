const Loading = () => {
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <span className="loading loading-infinity  w-[50px]"></span>
      </div>
    </div>
  );
};

export default Loading;
