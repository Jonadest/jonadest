import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10 mt-8">
      {/* <nav className="grid grid-flow-col gap-4 ">
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </nav> */}
      <nav>
        <p className="font-bold pb-3 md:text-2xl">Follow Us 🙋</p>
        <div className="grid grid-flow-col gap-4">
          <a
            href="https://web.facebook.com/Jonadestboss"
            title="Follow us on Facebook"
            target="_blank"
            className="cursor-pointer social-share-btn"
          >
            <FaFacebook size={24} />
          </a>

          <a
            href="https://www.instagram.com/jonadest.tech?igsh=MXdqdWZhaHZ3Z2M0Zw%3D%3D&utm_source=qr"
            title="Follow us on Instagram"
            target="_blank"
            className="cursor-pointer social-share-btn"
          >
            <FaInstagram size={24} />
          </a>

          <a
            href="https://www.tiktok.com/@jonadest"
            title="Follow us on Tiktok"
            target="_blank"
            className="cursor-pointer social-share-btn"
          >
            <FaTiktok size={24} />
          </a>

          <a
            href="https://www.youtube.com/@jonadest"
            title="Follow us on YouTube"
            target="_blank"
            className="cursor-pointer social-share-btn"
          >
            <FaYoutube size={24} />
          </a>
        </div>
      </nav>
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by{" "}
          <strong>Jonadest</strong>
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
