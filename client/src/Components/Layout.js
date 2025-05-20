import { Outlet } from 'react-router-dom';
import Menu from "./Menu";

function Layout({ isLogged }) {
  return (
    <div className="app-layout" style={{ display: 'flex' }}>
      <Menu />
      <main className="content" style={{ flex: 1 }}>
        <Outlet /> {/* Тут буде або Dashboard, або Boxes */}
      </main>
    </div>
  );
}

export default Layout;
