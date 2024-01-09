
import Carousel from './components/Carrusel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
/*import BottomBar2 from './components/BottomBar2';*/
import MapComponent from './components/MapaUbicacion';
import EditarUser from './components/EditarUser';
import MyNavbar from './components/NavBar2';
import { Layout, Menu, Row, Col, Image, Dropdown, Button, Badge, theme, Breadcrumb,Tooltip } from 'antd';
import AvisosPrincipalesAdmin from './components/AvisosPrincipalesAdmin';
const { Header , Content, Footer } = Layout;
import ProfileEditor from './components/EditarUser';
import MapWithMarkers from './components/GeoSector';
import MenuNavBar from './components/MenuNavBar';
import RealTimeTrackerMap from './components/RealTime';
import AvisosCarrusel from './components/prubaC';
import Admin from './components/menuadmin';



function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

;
  
  return (


    
    <Router>
      < MyNavbar/>
      <Layout>
      <Content >
      
      <div
        
        
      >
    
    
          <Routes>
          
          <Route path="/" element={< Admin/>}/>
          <Route path="/Mapa" element={<MapComponent/>} />
          <Route path="/Carrusel" element={<AvisosCarrusel/>} />
          <Route path="/Menu" element={<MenuNavBar/>} />
          <Route path="/perfil" element={<ProfileEditor/>} />
          </Routes>
          </div>
        </Content>
        
      </Layout>
      
    </Router>
    
  )
}
export default App
