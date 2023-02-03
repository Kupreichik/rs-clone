import { NavLink, Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <header className="container">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/workspace">Posts</NavLink>
        <NavLink to="/editor">Editor</NavLink>
      </header>
      <main className="container">
        <Outlet />
      </main>

      <footer className="container">2023</footer>
    </>
  );
};
