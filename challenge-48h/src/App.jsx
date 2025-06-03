import './App.css';
import 'leaflet/dist/leaflet.css';
import List from './components/List';
import MapBordeaux from './components/MapBordeaux';

function App() {
  return (
    <div className="main-layout">
      <div className="header-row">
        <List />
        <MapBordeaux/>
      </div>
    </div>
  );
}

export default App;
