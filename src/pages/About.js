import { Nav } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
const About = () => {
  return (
    <div>
      About Page
      <div>
          <Link to="/about/settings" className="nav-link">
            Settings
          </Link>
      </div>
      {/* ini untuk menampilkan data dari nested componenntnya (wajib) */}
      <Outlet/>
    </div>
  );
};

export default About;
