import React, { useContext } from 'react';
import './index.css';
import { Outlet, Link } from 'react-router-dom';
import { useGet } from '../../contexts/UserContext';

function DefaultTemplate() {
  const userResponse = useGet();

  let profile_button = <div>tet</div>;
  if (userResponse !== null) {
    if (!userResponse.user) {
      profile_button = (<>
        <a href={userResponse.login_url}>Log In</a>
      </>);
    }
    else {
      profile_button = (<>
        <a href={userResponse.logout_url}>Log Out</a>
      </>);
    }
  }

  return (
    <div className="DefaultTemplate">
      <nav className="DefaultTemplateNavBar">
        <img alt="" src="/img/icon_large.png" />
        <Link to="/">Home</Link>
        {profile_button}
      </nav>
      <div className="DefaultTemplateOutlet">
        <Outlet />
      </div>
    </div>
  );
}

export default DefaultTemplate;
