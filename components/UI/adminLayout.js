import React from 'react';
import Sidebar from '../../components/SidebarAdmin/sidebar';

const withLayoutAdmin = (WrappedComponent) => {
  const WithLayoutAdmin = (props) => (
    <div style={{ display: 'flex' }} dir='ltr' >
    <div className='w-[20%] h-full' style={{ zIndex: 1 }}>
      <Sidebar />
    </div>
    <div className='w-[80%] h-full' style={{ zIndex: 0 }}>
      <WrappedComponent {...props} />
    </div>
  </div>
  );

  // Provide a display name for the HOC
  WithLayoutAdmin.displayName = `withLayoutAdmin(${getDisplayName(WrappedComponent)})`;

  return WithLayoutAdmin;
};

// Helper function to get the display name of a component
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withLayoutAdmin;
