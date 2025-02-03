import "./Home.css";
import Footer from "../../components/Footer/Footer";
import LoginPopup from "../../components/LoginPopUp/LoginPopUp";
import Navbar from "../../components/Navbar/Navbar";

const Home = ({ isLogin, setIsLogin }) => {
  return (
    <div>
      <div className={`App ${isLogin ? "blur-background" : ""}`}>
        {isLogin && <LoginPopup setIsLogin={setIsLogin} />}
        <div className="body background">
          <Navbar setIsLogin={setIsLogin} />
          <div className="body-content">
            <div className="body-content-data">
              <div className="body-content-head">
                <span>Build something</span>
                <span>epic.</span>
              </div>
              <div className="body-content-btn">
                <button onClick={() => setIsLogin(true)}>Create account</button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
