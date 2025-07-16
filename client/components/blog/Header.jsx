import { assets } from "../assets/assets";
const Header = () => {
  return (
    <div className="flex justify-center">
      <div className="flex rounded-full bg-[#5044E51A] px-6 py-1 justify-center items-center ">
        <p className=" mr-1     text-[14px]">New Ai feature integrated</p>
        <span className="">
          <img className="" src={assets.star_icon} alt="Star icon" />
        </span>
      </div>
    </div>
  );
};

export default Header;
