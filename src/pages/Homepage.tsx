import { NavLink } from 'react-router-dom';

export const Homepage = () => {
  return (
    <section className="home">
      <div className="container">
        <div>
          <NavLink style={{ textDecoration: 'underline' }} to="/">
            Home
          </NavLink>
        </div>
        <div>
          <NavLink style={{ textDecoration: 'underline' }} to="/workspace">
            Posts
          </NavLink>
        </div>
        <div>
          <NavLink style={{ textDecoration: 'underline' }} to="/editor">
            Editor
          </NavLink>
        </div>
      </div>
    </section>
  );
};
